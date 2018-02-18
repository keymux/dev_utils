pipeline {
  agent any

  stages {
    stage("Build") {
      steps {
        sh "/bin/bash -c '. ~/.bash_profile; env; yarn install'"
        sh "mkdir -p reports"
      }
    }
    stage('Test') {
      steps {
        parallel (
          unitTests: { sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:unit'" },
          integrationTests: { sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:integration'" },
          changelog: {
            sh "/bin/bash -c '. ~/.bash_profile; env; yarn test:changelog | tee reports/changelog'"
            def comment = pullRequest.comment(new File('reports/changelog').text)
          }
        )
      }
    }
  }
}
