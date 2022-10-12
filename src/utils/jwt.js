import JWT from 'jsonwebtoken';
let secret = 'itsasecretkeyanditshardtoreadiknow';

export default {
  sign: (payload) => JWT.sign(payload, secret),
  verify: (payload) => JWT.verify(payload, secret)
}
