workflow "Test my code" {
  on = "push"
  resolves = ["codecov"]
}

action "npm cit" {
  uses = "docker://node:lts-alpine"
  runs = "npm"
  args = "cit"
}

action "codecov" {
  needs = "npm cit"
  uses = "docker://node:10"
  runs = "npx"
  args = "codecov"
  secrets = ["CODECOV_TOKEN"]
}
