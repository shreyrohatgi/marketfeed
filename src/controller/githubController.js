import axios from "axios";
import { githubSchemaValidator } from "../schema/githubSchemaValidator";

export const getGithubRepos = async (req, res) => {
  try {
    const queryData = {
      forks: req.query.forks,
      commits: req.query.commits,
    };

    await githubSchemaValidator.validate(queryData);

    let repoResponse = [];
    for (let i = 1; i <= queryData.forks; i += 100) {

      let perPage;
      if (i + 100 <= queryData.forks) {
        perPage = 100
      } else {
        perPage = queryData.forks
      }

      const pageNo = Math.floor(i / 100) + 1;
      console.log(pageNo);
      const resp = await axios.get(
        `https://api.github.com/search/repositories?q=forks:>0&sort=forks&order=desc&page=${pageNo}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `token ${process.env.token}`,
          },
        }
      );
      if (resp.data.items.length > 0) {
        repoResponse = repoResponse.concat(resp.data.items);
      } else {
        break;
      }
    }

    console.log(repoResponse.length);

    if (repoResponse.length <= 0) {
      return res.status(404).send("No Repos found");
    }

    const data = [];
    await Promise.all(
      repoResponse.map(async (repo) => {
        const obj = { repoName: repo.name, repoCommitters: [] };
        const commitResp = await axios.get(`${repo.contributors_url}`, {
          headers: {
            Authorization: `token ${process.env.token}`,
          },
        });
        if (commitResp) {
          commitResp.data.slice(0, queryData.commits).map((commit) => {
            obj.repoCommitters.push({
              name: `${commit.login}`,
              commits: `${commit.contributions}`,
            });
          });
        }
        data.push(obj);
      })
    );
    console.log(data.length);
    return res.status(200).send({ data });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
