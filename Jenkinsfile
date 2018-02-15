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
          unitTests: { sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:unit'" }
          integrationTests: { sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:integration'" }
          changelog: { sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:changelog'" }
        )
      }
    }
  }
}
