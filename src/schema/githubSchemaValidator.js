import * as yup from "yup";

export const githubSchemaValidator = yup.object().shape({
  forks: yup.number().required(),
  commits: yup.number().required(),
});
