pipeline {
  agent any

  stages {
    stage("Build") {
      steps {
        sh "git fetch --all"
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
