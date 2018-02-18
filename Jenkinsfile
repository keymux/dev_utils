pipeline {
  agent any

  stages {
    stage("Build PR") {
      steps {
        sh "/bin/bash -c '. ~/.bash_profile; env; yarn install'"
        sh "mkdir -p reports"
      }
    }
    stage('Test PR') {
      steps {
        parallel (
          unitTests: { sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:unit'" },
          integrationTests: { sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:integration'" },
          changelog: {
            sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:changelog | tee reports/changelog'"
          }
        )
      }
    }
    stage('Comment on PR') {
      steps {
        script {
          def comment = pullRequest.comment(new File('reports/changelog').text)
        }
      }
    }
  }
}
