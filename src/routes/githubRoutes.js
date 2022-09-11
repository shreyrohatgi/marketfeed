import express from "express";
import { getGithubRepos } from "../controller/githubController";

export const githubRoute = express.Router()

/**
 * API: to fetch github repos based on forks
 * METHOD: GET
 * URL: /api
 * ROUTE: PUBLIC
 */
githubRoute.get("/", getGithubRepos);
