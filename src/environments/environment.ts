export const environment = {
  production: false,
  // Miroir officiel open-source du dataset complet REST Countries v3.1 (GitLab)
  // Remplace l'ancienne URL restcountries.com/v3.1 qui a été dépréciée
  countriesApiUrl:
    'https://gitlab.com/restcountries/restcountries/-/raw/master/src/main/resources/countriesV3.1.json',
  localCountriesUrl: '/data/countries.json',
};
