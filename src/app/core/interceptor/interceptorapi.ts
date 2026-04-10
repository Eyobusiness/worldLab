import { HttpInterceptorFn } from '@angular/common/http';

export const Interceptorapi: HttpInterceptorFn = (req, next) => {
  // On cible uniquement les appels vers REST Countries
  if (req.url.includes('restcountries.com')) {
    const apiReq = req.clone({
      // On force les headers à vide pour éviter l'erreur 400
      setHeaders: {},
      // Optionnel: on s'assure qu'aucun header par défaut (comme Content-Type) ne passe
      headers: req.headers.delete('Content-Type'),
    });
    return next(apiReq);
  }

  return next(req);
};
