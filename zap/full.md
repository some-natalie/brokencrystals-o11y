# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 5 |
| Low | 5 |
| Informational | 6 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Low | Warning |  | ZAP warnings logged - see the zap.log file for details | 3    |
| Low | Exceeded High | http://192.168.107.12:3000 | Percentage of slow responses | 52 % |
| Info | Informational | http://192.168.107.12:3000 | Percentage of responses with status code 2xx | 93 % |
| Info | Informational | http://192.168.107.12:3000 | Percentage of responses with status code 3xx | 1 % |
| Info | Exceeded Low | http://192.168.107.12:3000 | Percentage of responses with status code 4xx | 5 % |
| Info | Informational | http://192.168.107.12:3000 | Percentage of endpoints with content type application/javascript | 31 % |
| Info | Informational | http://192.168.107.12:3000 | Percentage of endpoints with content type application/json | 5 % |
| Info | Informational | http://192.168.107.12:3000 | Percentage of endpoints with content type application/octet-stream | 5 % |
| Info | Informational | http://192.168.107.12:3000 | Percentage of endpoints with content type image/png | 11 % |
| Info | Informational | http://192.168.107.12:3000 | Percentage of endpoints with content type text/css | 28 % |
| Info | Informational | http://192.168.107.12:3000 | Percentage of endpoints with content type text/html | 11 % |
| Info | Informational | http://192.168.107.12:3000 | Percentage of endpoints with content type text/plain | 2 % |
| Info | Informational | http://192.168.107.12:3000 | Percentage of endpoints with method GET | 100 % |
| Info | Informational | http://192.168.107.12:3000 | Count of total endpoints | 35    |
| Info | Informational | https://fonts.googleapis.com | Percentage of responses with status code 2xx | 100 % |
| Info | Informational | https://fonts.googleapis.com | Percentage of slow responses | 100 % |
| Info | Informational | https://fonts.gstatic.com | Percentage of responses with status code 2xx | 100 % |
| Info | Informational | https://fonts.gstatic.com | Percentage of slow responses | 35 % |
| Info | Informational | https://maps.googleapis.com | Percentage of responses with status code 2xx | 100 % |
| Info | Informational | https://maps.googleapis.com | Percentage of slow responses | 76 % |
| Info | Informational | https://maps.gstatic.com | Percentage of responses with status code 2xx | 100 % |
| Info | Informational | https://maps.gstatic.com | Percentage of slow responses | 42 % |
| Info | Informational | https://www.google.com | Percentage of responses with status code 2xx | 100 % |
| Info | Informational | https://www.google.com | Percentage of slow responses | 72 % |




## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| Content Security Policy (CSP) Header Not Set | Medium | 3 |
| Hidden File Found | Medium | 2 |
| Missing Anti-clickjacking Header | Medium | 3 |
| Sub Resource Integrity Attribute Missing | Medium | 3 |
| Vulnerable JS Library | Medium | 1 |
| Cookie No HttpOnly Flag | Low | Systemic |
| Cookie without SameSite Attribute | Low | Systemic |
| Insufficient Site Isolation Against Spectre Vulnerability | Low | Systemic |
| Permissions Policy Header Not Set | Low | Systemic |
| X-Content-Type-Options Header Missing | Low | Systemic |
| Cookie Slack Detector | Informational | Systemic |
| Information Disclosure - Suspicious Comments | Informational | 5 |
| Modern Web Application | Informational | 3 |
| Session Management Response Identified | Informational | 5 |
| Storable but Non-Cacheable Content | Informational | Systemic |
| User Agent Fuzzer | Informational | Systemic |




## Alert Detail



### [ Content Security Policy (CSP) Header Not Set ](https://www.zaproxy.org/docs/alerts/10038/)



##### Medium (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

* URL: http://192.168.107.12:3000
  * Node Name: `http://192.168.107.12:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/sitemap.xml
  * Node Name: `http://192.168.107.12:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that your web server, application server, load balancer, etc. is configured to set the Content-Security-Policy header.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
* [ https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html ](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://w3c.github.io/webappsec-csp/ ](https://w3c.github.io/webappsec-csp/)
* [ https://web.dev/articles/csp ](https://web.dev/articles/csp)
* [ https://caniuse.com/#feat=contentsecuritypolicy ](https://caniuse.com/#feat=contentsecuritypolicy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ Hidden File Found ](https://www.zaproxy.org/docs/alerts/40035/)



##### Medium (High)

### Description

A sensitive file was identified as accessible or available. This may leak administrative, configuration, or credential information which can be leveraged by a malicious individual to further attack the system or conduct social engineering efforts.

* URL: http://192.168.107.12:3000/.git/config
  * Node Name: `http://192.168.107.12:3000/.git/config`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 200 OK`
  * Other Info: `git_dir`
* URL: http://192.168.107.12:3000/.svn/wc.db
  * Node Name: `http://192.168.107.12:3000/.svn/wc.db`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 200 OK`
  * Other Info: `svn_dir`


Instances: 2

### Solution

Consider whether or not the component is actually required in production, if it isn't then disable it. If it is then ensure access to it requires appropriate authentication and authorization, or limit exposure to internal systems or specific source IPs, etc.

### Reference


* [ https://blog.hboeck.de/archives/892-Introducing-Snallygaster-a-Tool-to-Scan-for-Secrets-on-Web-Servers.html ](https://blog.hboeck.de/archives/892-Introducing-Snallygaster-a-Tool-to-Scan-for-Secrets-on-Web-Servers.html)
* [ https://git-scm.com/docs/git-config ](https://git-scm.com/docs/git-config)


#### CWE Id: [ 538 ](https://cwe.mitre.org/data/definitions/538.html)


#### WASC Id: 13

#### Source ID: 1

### [ Missing Anti-clickjacking Header ](https://www.zaproxy.org/docs/alerts/10020/)



##### Medium (Medium)

### Description

The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

* URL: http://192.168.107.12:3000
  * Node Name: `http://192.168.107.12:3000`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/sitemap.xml
  * Node Name: `http://192.168.107.12:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Modern Web browsers support the Content-Security-Policy and X-Frame-Options HTTP headers. Ensure one of them is set on all web pages returned by your site/app.
If you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. Alternatively consider implementing Content Security Policy's "frame-ancestors" directive.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options)


#### CWE Id: [ 1021 ](https://cwe.mitre.org/data/definitions/1021.html)


#### WASC Id: 15

#### Source ID: 3

### [ Sub Resource Integrity Attribute Missing ](https://www.zaproxy.org/docs/alerts/90003/)



##### Medium (High)

### Description

The integrity attribute is missing on a script or link tag served by an external server. The integrity tag prevents an attacker who have gained access to this server from injecting a malicious content.

* URL: http://192.168.107.12:3000
  * Node Name: `http://192.168.107.12:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<link
      href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Roboto:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i"
      rel="stylesheet"
    />`
  * Other Info: ``
* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<link
      href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Roboto:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i"
      rel="stylesheet"
    />`
  * Other Info: ``
* URL: http://192.168.107.12:3000/sitemap.xml
  * Node Name: `http://192.168.107.12:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<link
      href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Roboto:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i"
      rel="stylesheet"
    />`
  * Other Info: ``


Instances: 3

### Solution

Provide a valid integrity attribute to the tag.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity ](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)


#### CWE Id: [ 345 ](https://cwe.mitre.org/data/definitions/345.html)


#### WASC Id: 15

#### Source ID: 3

### [ Vulnerable JS Library ](https://www.zaproxy.org/docs/alerts/10003/)



##### Medium (Medium)

### Description

The identified library appears to be vulnerable.

* URL: http://192.168.107.12:3000/assets/vendor/jquery/jquery.min.js
  * Node Name: `http://192.168.107.12:3000/assets/vendor/jquery/jquery.min.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `/*! jQuery v3.4.1`
  * Other Info: `The identified library jquery, version 3.4.1 is vulnerable.
CVE-2020-11023
CVE-2020-11022
https://blog.jquery.com/2020/04/10/jquery-3-5-0-released/
`


Instances: 1

### Solution

Upgrade to the latest version of the affected library.

### Reference


* [ https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/ ](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)


#### CWE Id: [ 1395 ](https://cwe.mitre.org/data/definitions/1395.html)


#### Source ID: 3

### [ Cookie No HttpOnly Flag ](https://www.zaproxy.org/docs/alerts/10010/)



##### Low (Medium)

### Description

A cookie has been set without the HttpOnly flag, which means that the cookie can be accessed by JavaScript. If a malicious script can be run on this page then the cookie will be accessible and can be transmitted to another site. If this is a session cookie then session hijacking may be possible.

* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `set-cookie: connect.sid`
  * Other Info: ``
* URL: http://192.168.107.12:3000/assets/vendor/boxicons/css/boxicons.min.css
  * Node Name: `http://192.168.107.12:3000/assets/vendor/boxicons/css/boxicons.min.css`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `set-cookie: connect.sid`
  * Other Info: ``
* URL: http://192.168.107.12:3000/assets/vendor/icofont/icofont.min.css
  * Node Name: `http://192.168.107.12:3000/assets/vendor/icofont/icofont.min.css`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `set-cookie: connect.sid`
  * Other Info: ``
* URL: http://192.168.107.12:3000/favicons/android-icon-192x192.png
  * Node Name: `http://192.168.107.12:3000/favicons/android-icon-192x192.png`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `set-cookie: connect.sid`
  * Other Info: ``
* URL: http://192.168.107.12:3000/favicons/apple-icon-180x180.png
  * Node Name: `http://192.168.107.12:3000/favicons/apple-icon-180x180.png`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `set-cookie: connect.sid`
  * Other Info: ``

Instances: Systemic


### Solution

Ensure that the HttpOnly flag is set for all cookies.

### Reference


* [ https://owasp.org/www-community/HttpOnly ](https://owasp.org/www-community/HttpOnly)


#### CWE Id: [ 1004 ](https://cwe.mitre.org/data/definitions/1004.html)


#### WASC Id: 13

#### Source ID: 3

### [ Cookie without SameSite Attribute ](https://www.zaproxy.org/docs/alerts/10054/)



##### Low (Medium)

### Description

A cookie has been set without the SameSite attribute, which means that the cookie can be sent as a result of a 'cross-site' request. The SameSite attribute is an effective counter measure to cross-site request forgery, cross-site script inclusion, and timing attacks.

* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `set-cookie: connect.sid`
  * Other Info: ``
* URL: http://192.168.107.12:3000/assets/vendor/boxicons/css/boxicons.min.css
  * Node Name: `http://192.168.107.12:3000/assets/vendor/boxicons/css/boxicons.min.css`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `set-cookie: connect.sid`
  * Other Info: ``
* URL: http://192.168.107.12:3000/assets/vendor/icofont/icofont.min.css
  * Node Name: `http://192.168.107.12:3000/assets/vendor/icofont/icofont.min.css`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `set-cookie: connect.sid`
  * Other Info: ``
* URL: http://192.168.107.12:3000/favicons/android-icon-192x192.png
  * Node Name: `http://192.168.107.12:3000/favicons/android-icon-192x192.png`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `set-cookie: connect.sid`
  * Other Info: ``
* URL: http://192.168.107.12:3000/favicons/apple-icon-180x180.png
  * Node Name: `http://192.168.107.12:3000/favicons/apple-icon-180x180.png`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `set-cookie: connect.sid`
  * Other Info: ``

Instances: Systemic


### Solution

Ensure that the SameSite attribute is set to either 'lax' or ideally 'strict' for all cookies.

### Reference


* [ https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-same-site ](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-same-site)


#### CWE Id: [ 1275 ](https://cwe.mitre.org/data/definitions/1275.html)


#### WASC Id: 13

#### Source ID: 3

### [ Insufficient Site Isolation Against Spectre Vulnerability ](https://www.zaproxy.org/docs/alerts/90004/)



##### Low (Medium)

### Description

Cross-Origin-Resource-Policy header is an opt-in header designed to counter side-channels attacks like Spectre. Resource should be specifically set as shareable amongst different origins.

* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: `Cross-Origin-Resource-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/assets/vendor/venobox/venobox.css
  * Node Name: `http://192.168.107.12:3000/assets/vendor/venobox/venobox.css`
  * Method: `GET`
  * Parameter: `Cross-Origin-Resource-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/favicons/android-icon-192x192.png
  * Node Name: `http://192.168.107.12:3000/favicons/android-icon-192x192.png`
  * Method: `GET`
  * Parameter: `Cross-Origin-Resource-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/favicons/apple-icon-180x180.png
  * Node Name: `http://192.168.107.12:3000/favicons/apple-icon-180x180.png`
  * Method: `GET`
  * Parameter: `Cross-Origin-Resource-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/robots.txt
  * Node Name: `http://192.168.107.12:3000/robots.txt`
  * Method: `GET`
  * Parameter: `Cross-Origin-Resource-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: `Cross-Origin-Opener-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: Systemic


### Solution

Ensure that the application/web server sets the Cross-Origin-Resource-Policy header appropriately, and that it sets the Cross-Origin-Resource-Policy header to 'same-origin' for all web pages.
'same-site' is considered as less secured and should be avoided.
If resources must be shared, set the header to 'cross-origin'.
If possible, ensure that the end user uses a standards-compliant and modern web browser that supports the Cross-Origin-Resource-Policy header (https://caniuse.com/mdn-http_headers_cross-origin-resource-policy).

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 14

#### Source ID: 3

### [ Permissions Policy Header Not Set ](https://www.zaproxy.org/docs/alerts/10063/)



##### Low (Medium)

### Description

Permissions Policy Header is an added layer of security that helps to restrict from unauthorized access or usage of browser/client features by web resources. This policy ensures the user privacy by limiting or specifying the features of the browsers can be used by the web resources. Permissions Policy provides a set of standard HTTP headers that allow website owners to limit which features of browsers can be used by the page such as camera, microphone, location, full screen etc.

* URL: http://192.168.107.12:3000
  * Node Name: `http://192.168.107.12:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/assets/vendor/aos/aos.js
  * Node Name: `http://192.168.107.12:3000/assets/vendor/aos/aos.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/assets/vendor/jquery.easing/jquery.easing.min.js
  * Node Name: `http://192.168.107.12:3000/assets/vendor/jquery.easing/jquery.easing.min.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/sitemap.xml
  * Node Name: `http://192.168.107.12:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: Systemic


### Solution

Ensure that your web server, application server, load balancer, etc. is configured to set the Permissions-Policy header.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy)
* [ https://developer.chrome.com/blog/feature-policy/ ](https://developer.chrome.com/blog/feature-policy/)
* [ https://scotthelme.co.uk/a-new-security-header-feature-policy/ ](https://scotthelme.co.uk/a-new-security-header-feature-policy/)
* [ https://w3c.github.io/webappsec-feature-policy/ ](https://w3c.github.io/webappsec-feature-policy/)
* [ https://www.smashingmagazine.com/2018/12/feature-policy/ ](https://www.smashingmagazine.com/2018/12/feature-policy/)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ X-Content-Type-Options Header Missing ](https://www.zaproxy.org/docs/alerts/10021/)



##### Low (Medium)

### Description

The Anti-MIME-Sniffing header X-Content-Type-Options was not set to 'nosniff'. This allows older versions of Internet Explorer and Chrome to perform MIME-sniffing on the response body, potentially causing the response body to be interpreted and displayed as a content type other than the declared content type. Current (early 2014) and legacy versions of Firefox will use the declared content type (if one is set), rather than performing MIME-sniffing.

* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://192.168.107.12:3000/assets/vendor/boxicons/css/boxicons.min.css
  * Node Name: `http://192.168.107.12:3000/assets/vendor/boxicons/css/boxicons.min.css`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://192.168.107.12:3000/favicons/android-icon-192x192.png
  * Node Name: `http://192.168.107.12:3000/favicons/android-icon-192x192.png`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://192.168.107.12:3000/favicons/apple-icon-180x180.png
  * Node Name: `http://192.168.107.12:3000/favicons/apple-icon-180x180.png`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://192.168.107.12:3000/vendor/slick/slick.css
  * Node Name: `http://192.168.107.12:3000/vendor/slick/slick.css`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`

Instances: Systemic


### Solution

Ensure that the application/web server sets the Content-Type header appropriately, and that it sets the X-Content-Type-Options header to 'nosniff' for all web pages.
If possible, ensure that the end user uses a standards-compliant and modern web browser that does not perform MIME-sniffing at all, or that can be directed by the web application/web server to not perform MIME-sniffing.

### Reference


* [ https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85) ](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85))
* [ https://owasp.org/www-community/Security_Headers ](https://owasp.org/www-community/Security_Headers)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ Cookie Slack Detector ](https://www.zaproxy.org/docs/alerts/90027/)



##### Informational (Low)

### Description

Repeated GET requests: drop a different cookie each time, followed by normal request with all cookies to stabilize session, compare responses against original baseline GET. This can reveal areas where cookie based authentication/attributes are not actually enforced.

* URL: http://192.168.107.12:3000
  * Node Name: `http://192.168.107.12:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: `Cookies that don't have expected effects can reveal flaws in application logic. In the worst case, this can reveal where authentication via cookie token(s) is not actually enforced.
These cookies affected the response: 
These cookies did NOT affect the response: connect.sid
`
* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: `Cookies that don't have expected effects can reveal flaws in application logic. In the worst case, this can reveal where authentication via cookie token(s) is not actually enforced.
These cookies affected the response: 
These cookies did NOT affect the response: connect.sid
`
* URL: http://192.168.107.12:3000/api
  * Node Name: `http://192.168.107.12:3000/api`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: `Cookies that don't have expected effects can reveal flaws in application logic. In the worst case, this can reveal where authentication via cookie token(s) is not actually enforced.
These cookies affected the response: 
These cookies did NOT affect the response: connect.sid
`
* URL: http://192.168.107.12:3000/api/config
  * Node Name: `http://192.168.107.12:3000/api/config`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: `Cookies that don't have expected effects can reveal flaws in application logic. In the worst case, this can reveal where authentication via cookie token(s) is not actually enforced.
These cookies affected the response: 
These cookies did NOT affect the response: bc-calls-counter,connect.sid
`
* URL: http://192.168.107.12:3000/assets
  * Node Name: `http://192.168.107.12:3000/assets`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: `Cookies that don't have expected effects can reveal flaws in application logic. In the worst case, this can reveal where authentication via cookie token(s) is not actually enforced.
These cookies affected the response: 
These cookies did NOT affect the response: connect.sid
`

Instances: Systemic


### Solution



### Reference


* [ https://cwe.mitre.org/data/definitions/205.html ](https://cwe.mitre.org/data/definitions/205.html)


#### CWE Id: [ 205 ](https://cwe.mitre.org/data/definitions/205.html)


#### WASC Id: 45

#### Source ID: 1

### [ Information Disclosure - Suspicious Comments ](https://www.zaproxy.org/docs/alerts/10027/)



##### Informational (Medium)

### Description

The response appears to contain suspicious comments which may help an attacker.

* URL: http://192.168.107.12:3000/assets/index-BgqCpeGa.js
  * Node Name: `http://192.168.107.12:3000/assets/index-BgqCpeGa.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `select`
  * Other Info: `The following pattern was used: \bSELECT\b and was detected in likely comment: "//www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}funct", see evidence field for the suspicious comment/snippet.`
* URL: http://192.168.107.12:3000/assets/vendor/jquery/jquery.min.js
  * Node Name: `http://192.168.107.12:3000/assets/vendor/jquery/jquery.min.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `username`
  * Other Info: `The following pattern was used: \bUSERNAME\b and was detected in likely comment: "//,It={},Wt={},$t="*/".concat("*"),Ft=E.createElement("a");function Bt(o){return function(e,t){"string"!=typeof e&&(t=e,e="*");v", see evidence field for the suspicious comment/snippet.`
* URL: http://192.168.107.12:3000
  * Node Name: `http://192.168.107.12:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `user`
  * Other Info: `The following pattern was used: \bUSER\b and was detected in likely comment: "<!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See h", see evidence field for the suspicious comment/snippet.`
* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `user`
  * Other Info: `The following pattern was used: \bUSER\b and was detected in likely comment: "<!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See h", see evidence field for the suspicious comment/snippet.`
* URL: http://192.168.107.12:3000/sitemap.xml
  * Node Name: `http://192.168.107.12:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `user`
  * Other Info: `The following pattern was used: \bUSER\b and was detected in likely comment: "<!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See h", see evidence field for the suspicious comment/snippet.`


Instances: 5

### Solution

Remove all comments that return information that may help an attacker and fix any underlying problems they refer to.

### Reference



#### CWE Id: [ 615 ](https://cwe.mitre.org/data/definitions/615.html)


#### WASC Id: 13

#### Source ID: 3

### [ Modern Web Application ](https://www.zaproxy.org/docs/alerts/10109/)



##### Informational (Medium)

### Description

The application appears to be a modern web application. If you need to explore it automatically then the Ajax Spider may well be more effective than the standard one.

* URL: http://192.168.107.12:3000
  * Node Name: `http://192.168.107.12:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script id="config" type="application/json" src="/api/config"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`
* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script id="config" type="application/json" src="/api/config"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`
* URL: http://192.168.107.12:3000/sitemap.xml
  * Node Name: `http://192.168.107.12:3000/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script id="config" type="application/json" src="/api/config"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`


Instances: 3

### Solution

This is an informational alert and so no changes are required.

### Reference




#### Source ID: 3

### [ Session Management Response Identified ](https://www.zaproxy.org/docs/alerts/10112/)



##### Informational (Medium)

### Description

The given response has been identified as containing a session management token. The 'Other Info' field contains a set of header tokens that can be used in the Header Based Session Management Method. If the request is in a context which has a Session Management Method set to "Auto-Detect" then this rule will change the session management to use the tokens identified.

* URL: http://192.168.107.12:3000
  * Node Name: `http://192.168.107.12:3000`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `connect.sid`
  * Other Info: `cookie:connect.sid`
* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `connect.sid`
  * Other Info: `cookie:connect.sid`
* URL: http://192.168.107.12:3000/api/config
  * Node Name: `http://192.168.107.12:3000/api/config`
  * Method: `GET`
  * Parameter: `bc-calls-counter`
  * Attack: ``
  * Evidence: `bc-calls-counter`
  * Other Info: `cookie:bc-calls-counter
cookie:connect.sid`
* URL: http://192.168.107.12:3000/manifest.json
  * Node Name: `http://192.168.107.12:3000/manifest.json`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `connect.sid`
  * Other Info: `cookie:connect.sid`
* URL: http://192.168.107.12:3000/robots.txt
  * Node Name: `http://192.168.107.12:3000/robots.txt`
  * Method: `GET`
  * Parameter: `connect.sid`
  * Attack: ``
  * Evidence: `connect.sid`
  * Other Info: `cookie:connect.sid`


Instances: 5

### Solution

This is an informational alert rather than a vulnerability and so there is nothing to fix.

### Reference


* [ https://www.zaproxy.org/docs/desktop/addons/authentication-helper/session-mgmt-id/ ](https://www.zaproxy.org/docs/desktop/addons/authentication-helper/session-mgmt-id/)



#### Source ID: 3

### [ Storable but Non-Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, but will not be retrieved directly from the cache, without validating the request upstream, in response to similar requests from other users.

* URL: http://192.168.107.12:3000/
  * Node Name: `http://192.168.107.12:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: http://192.168.107.12:3000/assets/vendor/venobox/venobox.css
  * Node Name: `http://192.168.107.12:3000/assets/vendor/venobox/venobox.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: http://192.168.107.12:3000/favicons/android-icon-192x192.png
  * Node Name: `http://192.168.107.12:3000/favicons/android-icon-192x192.png`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: http://192.168.107.12:3000/favicons/apple-icon-180x180.png
  * Node Name: `http://192.168.107.12:3000/favicons/apple-icon-180x180.png`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: http://192.168.107.12:3000/robots.txt
  * Node Name: `http://192.168.107.12:3000/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``

Instances: Systemic


### Solution



### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3

### [ User Agent Fuzzer ](https://www.zaproxy.org/docs/alerts/10104/)



##### Informational (Medium)

### Description

Check for differences in response based on fuzzed User Agent (eg. mobile sites, access as a Search Engine Crawler). Compares the response statuscode and the hashcode of the response body with the original response.

* URL: http://192.168.107.12:3000/vendor
  * Node Name: `http://192.168.107.12:3000/vendor`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)`
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/vendor
  * Node Name: `http://192.168.107.12:3000/vendor`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)`
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/vendor
  * Node Name: `http://192.168.107.12:3000/vendor`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)`
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/vendor
  * Node Name: `http://192.168.107.12:3000/vendor`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko`
  * Evidence: ``
  * Other Info: ``
* URL: http://192.168.107.12:3000/vendor
  * Node Name: `http://192.168.107.12:3000/vendor`
  * Method: `GET`
  * Parameter: `Header User-Agent`
  * Attack: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3739.0 Safari/537.36 Edg/75.0.109.0`
  * Evidence: ``
  * Other Info: ``

Instances: Systemic


### Solution



### Reference


* [ https://owasp.org/wstg ](https://owasp.org/wstg)



#### Source ID: 1


