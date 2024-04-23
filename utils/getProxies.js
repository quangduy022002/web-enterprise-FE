export const baseUrl = 'http://103.77.172.5:8080/'

export function getProxies () {
  return {
    '/api/account': {
      target: `${baseUrl}/account`,
      pathRewrite: {
        '^/api/account/': '/'
      }
    },
    '/api/auth': {
      target: `${baseUrl}/auth`,
      pathRewrite: {
        '^/api/auth/': '/'
      }
    },
    '/api/media': {
      target: `${baseUrl}/media`,
      pathRewrite: {
        '^/api/media/': '/'
      }
    },
    '/api/faculty': {
      target: `${baseUrl}/faculty`,
      pathRewrite: {
        '^/api/faculty/': '/'
      }
    },
    '/api/period': {
      target: `${baseUrl}/period`,
      pathRewrite: {
        '^/api/period/': '/'
      }
    },
    '/api/submission': {
      target: `${baseUrl}/submission`,
      pathRewrite: {
        '^/api/submission/': '/'
      }
    },
    '/api/comment': {
      target: `${baseUrl}/comment`,
      pathRewrite: {
        '^/api/comment/': '/'
      }
    },
    '/api/feedback': {
      target: `${baseUrl}/feedback`,
      pathRewrite: {
        '^/api/feedback/': '/'
      }
    }
  }
}
