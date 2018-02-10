pipeline {
  agent any

  stages {
    stage("Build") {
      steps {
        sh "git config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'"
        sh "git pull || echo # So we don't fail"
        sh "git branch -a"
        sh "git ls-remote --heads"
        sh "echo ${CHANGE_TARGET}"
        sh "/bin/bash -c '. ~/.bash_profile; env; yarn install'"
      }
    }
    stage('Test') {
      steps {
        sh "/bin/bash -c '. ~/.bash_profile; env; yarn test'"
      }
    }
  }
}
