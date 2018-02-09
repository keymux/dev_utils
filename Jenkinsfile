pipeline {
  agent any

  stages {
    stage("Build") {
      steps {
        sh "/bin/bash -c '. ~/.bash_profile; yarn install'"
      }
    }
    stage('Test') {
      steps {
        sh "/bin/bash -c '. ~/.bash_profile; yarn test'"
      }
    }
  }
}
