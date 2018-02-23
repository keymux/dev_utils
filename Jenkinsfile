pipeline {
  agent any

  stages {
    stage("build") {
      steps {
        parallel (
          "clean": { sh "/bin/bash -c '. ~/.bash_profile; yarn clean'" },
          "env": { sh "/bin/bash -c 'env'" },
          "install": { sh "/bin/bash -c '. ~/.bash_profile; yarn install'" }
        )
      }
    }
    stage("test") {
      steps {
        parallel (
          "test:changelog": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:changelog'" },
          "test:coverage": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:coverage'" },
          "test:integration": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:integration'" },
          "test:lint": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:lint'" },
          "test:unit": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:unit'" }
        )
      }
    }
    stage("metrics") {
      steps {
        parallel (
          "create:test:summary": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:summary'" },
          "publish:test::coverage:metrics": {
            publishHTML([
              allowMissing: false,
              alwaysLinkToLastBuild: false,
              keepAll: true,
              reportDir: 'reports/unit/coverage/lcov-report',
              reportFiles: 'index.html',
              reportName: 'Unit Testing Coverage Metrics',
              reportTitles: 'Unit Testing Coverage Metrics'
            ])
          },
          "publish:test:unit:metrics": {
            publishHTML([
              allowMissing: false,
              alwaysLinkToLastBuild: false,
              keepAll: true,
              reportDir: 'reports/unit',
              reportFiles: 'mochawesome.html',
              reportName: 'Unit Testing Metrics',
              reportTitles: 'Unit Testing Metrics'
            ])
          }
        )
      }
    }
    stage("resolve") {
      steps {
        parallel (
          "test:changelog": { sh "/bin/bash -c '. ~/.bash_profile; yarn resolve test:changelog'" },
          "test:coverage": { sh "/bin/bash -c '. ~/.bash_profile; yarn resolve test:coverage'" },
          "test:integration": { sh "/bin/bash -c '. ~/.bash_profile; yarn resolve test:integration'" },
          "test:lint": { sh "/bin/bash -c '. ~/.bash_profile; yarn resolve test:lint'" },
          "test:unit": { sh "/bin/bash -c '. ~/.bash_profile; yarn resolve test:unit'" }
        )
      }
    }
  }
}
