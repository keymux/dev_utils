pipeline {
  agent any

  stages {
    stage("Build") {
      steps {
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
