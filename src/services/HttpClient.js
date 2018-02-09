class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.params = '?country=CN&language=en';
  }

  concatUrl(isToken, tokenOrGuestId, subjectUrl) {
    if (isToken) {
      return `${this.baseUrl}/users/me/${subjectUrl}${this.params}&token=${tokenOrGuestId}`;
    } else {
      return `${this.baseUrl}/guests/${tokenOrGuestId}/${subjectUrl}${this.params}`;
    }
  };

  concatUrlPassParams(isToken, tokenOrGuestId, subjectUrl, params) {
    if (isToken) {
      return `${this.baseUrl}/users/me/${subjectUrl}${params}&token=${tokenOrGuestId}`;
    } else {
      return `${this.baseUrl}/guests/${tokenOrGuestId}/${subjectUrl}${params}`;
    }
  };

  fetch(isToken, tokenOrGuestId, subjectUrl, params) {
    const url = this.concatUrl(isToken, tokenOrGuestId, subjectUrl);
    return fetch(url, params);
  }

  fetchParams(isToken, tokenOrGuestId, subjectUrl, query, params) {
    const url = this.concatUrlPassParams(isToken, tokenOrGuestId, subjectUrl,
        query);
    return fetch(url, params);
  }
}

export default new HttpClient('https://preprod-api.apps.burberry.com/v1/ecom-env-proxy/qa4');