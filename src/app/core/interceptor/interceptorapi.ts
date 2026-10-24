import { HttpInterceptorFn } from '@angular/common/http';

export const Interceptorapi: HttpInterceptorFn = (req, next) => {
  // On cible les appels vers les données pays (REST Countries, GitLab, assets locaux)
  if (
    req.url.includes('restcountries.com') ||
    req.url.includes('gitlab.com') ||
    req.url.includes('countries.json')
  ) {
    const apiReq = req.clone({
      headers: req.headers.delete('Content-Type'),
    });
    return next(apiReq);
  }

  return next(req);
};
