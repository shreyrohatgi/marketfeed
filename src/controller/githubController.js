import axios from "axios";
import { githubSchemaValidator } from "../schema/githubSchemaValidator";

export const getGithubRepos = async (req, res) => {
  try {
    const response = {};

    const data = {
      forks: req.query.forks,
      commits: req.query.commits,
    };

    await githubSchemaValidator.validate(data);

    const repoResponse = await axios.get(
      `https://api.github.com/search/repositories?q=forks:>0&sort=forks&per_page=${data.forks}`
    );

    if (repoResponse.data.items.length <= 0) {
      return res.status(404).send("No Repos found");
    }

    if (repoResponse) {
      const wholeData = [];
      repoResponse.data.items.forEach(async (repo) => {
        const obj = { repoName: repo.name, repoCommitters: [] };
        const commitResp = await axios.get(`${repo.contributors_url}`);
        if (commitResp) {
          const comm = [];
          const committers = commitResp.data.slice(0, data.commits);
          committers.forEach((commit) => {
            comm.push({ name: `${commit.login}`, commits: `${commit.contributions}` });
          })
          obj.repoCommitters = comm;
        }
        console.log({obj});
        wholeData.push(obj);
        console.log({wholeData});
      })
      response.data = wholeData;
      res.status(200).json(response);
    }

  } catch (error) {
    res.status(400).send(error);
  }
};
