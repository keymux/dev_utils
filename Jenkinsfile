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
        echo "Hello world before comment"
        script {
          println "Hello, world!1"
          def text = new File(env['WORKSPACE'] + '/reports/changelog').text
          println "Hello, world!2"
          def comment = pullRequest.comment(text)
          println "Hello, world!3"
        }
        echo "Hello world after comment"
      }
    }
  }
}
