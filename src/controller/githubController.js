import axios from "axios";
import { githubSchemaValidator } from "../schema/githubSchemaValidator";

export const getGithubRepos = async (req, res) => {
  try {
    const queryData = {
      forks: req.query.forks,
      commits: req.query.commits,
    };

    await githubSchemaValidator.validate(queryData);

    const repoResponse = await axios.get(
      `https://api.github.com/search/repositories?q=forks:>${queryData.forks}&sort=forks`
    );

    if (repoResponse.data.items.length <= 0) {
      return res.status(404).send("No Repos found");
    }

    const data = [];
    if (repoResponse) {
      await Promise.all(repoResponse.data.items.map(async (repo) => {
        const obj = { repoName: repo.name, repoCommitters: [] };
        const commitResp = await axios.get(`${repo.contributors_url}`);
        if (commitResp) {
          const committers = commitResp.data.slice(0, queryData.commits);
          committers.map((commit) => {
            obj.repoCommitters.push({ name: `${commit.login}`, commits: `${commit.contributions}` });
          })
        }
        data.push(obj);
      }))
    }
    res.status(200).send({data});
  } catch (error) {
    res.status(400).send(error);
  }
};
