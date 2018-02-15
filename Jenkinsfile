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
        parallel (
          sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:unit'"
          sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:integration'"
          sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:changelog'"
        )
      }
    }
  }
}
