export const baseUrls = {
  development: 'http://localhost:8080/'
}

export const baseUrl = baseUrls

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
