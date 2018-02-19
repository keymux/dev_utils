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
    stage("Test PR") {
      steps {
        parallel (
          unitTests: { sh "/bin/bash -c '. ~/.bash_profile; yarn test:unit'" },
          integrationTests: { sh "/bin/bash -c '. ~/.bash_profile; yarn test:integration'" },
          changelog: { sh "/bin/bash -c '. ~/.bash_profile; yarn test:changelog'" },
          coverage: { sh "/bin/bash -c '. ~/.bash_profile; yarn test:coverage'" }
        )
      }
    }
    stage("Test Summary") {
      steps {
        sh "/bin/bash -c '. ~/.bash_profile; yarn test:summary'"
        publishHTML([
          allowMissing: false,
          alwaysLinkToLastBuild: false,
          keepAll: true,
          reportDir: 'reports/unit',
          reportFiles: 'mochawesome.html',
          reportName: 'Unit Testing Metrics',
          reportTitles: 'Unit Testing Metrics'
        ])
        publishHTML([
          allowMissing: false,
          alwaysLinkToLastBuild: false,
          keepAll: true,
          reportDir: 'reports/unit/coverage/lcov-report',
          reportFiles: 'index.html',
          reportName: 'Unit Testing Coverage Metrics',
          reportTitles: 'Unit Testing Coverage Metrics'
        ])
      }
    }
  }
}
