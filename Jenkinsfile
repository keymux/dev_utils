pipeline {
  agent any

  stages {
    stage("Build PR") {
      steps {
        sh "/bin/bash -c '. ~/.bash_profile; env; yarn install'"
        sh "rm -rf reports"
        sh "mkdir -p reports"
      }
    }
    stage('Test PR') {
      steps {
        parallel (
          unitTests: { sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:unit'" },
          integrationTests: { sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:integration'" },
          changelog: {
            sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:changelog'"
          }
        )
      }
    }
  }
}
