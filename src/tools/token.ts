import jwt from 'jsonwebtoken';

const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQCjba4w+p3hj5Dsqv2lo3x1h8iZ1YaadG3xi7ha7zMYY5Rymepu
9WuEeSTbCWZQfjgI1pgsvJqkM07BEX415XKY6K/lBr/ld9F8Hvhin/mFSg3Ezs8F
sEOl98/Cazypt7nci+RayxQyPTr64fpKROGVjmn09ONeAuyWfhn4NnpzlwIDAQAB
AoGAXd1cA+OdlHTJzzSydFU+4Z44WCqsob+neek+3HOwTBy9oUjHvi0VMMQHqApx
CmBEPMdMJb25r/+MBxXOAJSlSUHdLVOss9OO+Mqb99gfePE1ERQQK1P6mnEyQh4/
zEiOlmSkFX7dvOBnS8cU1gsp5v95+GSrI4SQbm0RqfEhMbkCQQDvKYTRUVm+VDrr
/m8Ph1tzloLkZmUA+aJJVpKJYcHscpn69IlKuAgvVxb5hf6JLN0BU6eHOUXKrqeD
Pn+k4r69AkEAru8xZ5N6qKosbLSopkn2MwBhE8/kkMCvDo+wkbDwZt4tOQeGq1di
hdVHwJh/SRgho5lVTnbVX66LzY36ro664wJASfw8HEzgSGLiP3NchB9JiT58i4+p
m12eeLWRa3KUfUMOo3XWqwi3b32vm8156pG4ZNquLsTm9EaHh7Bj6GxEuQJAYymX
2dzR5RZCBIUMLOc0Noj6fp6UNDHlid2N+6hPPiCnhfJsNmhcovzZpaVMUgTp3LEo
mEfogEqTWTwoZBbofQJAAf0GUGcZlPmH7fVKJqvy3eUdtD34twsWs6jy5aVZ7+/k
Zz4Hk0irWYnCwg8MFIYXJUBLBl7AhQjIx1XvUL9nmg==
-----END RSA PRIVATE KEY-----`

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjba4w+p3hj5Dsqv2lo3x1h8iZ
1YaadG3xi7ha7zMYY5Rymepu9WuEeSTbCWZQfjgI1pgsvJqkM07BEX415XKY6K/l
Br/ld9F8Hvhin/mFSg3Ezs8FsEOl98/Cazypt7nci+RayxQyPTr64fpKROGVjmn0
9ONeAuyWfhn4NnpzlwIDAQAB
-----END PUBLIC KEY-----`

export class Token {
	public static signJwt(payload, expiresIn) {
		return jwt.sign(payload, privateKey, {algorithm:"RS256", expiresIn});
	}
  
	public static verifyJwt(token) {
	  try {
		  const verified = jwt.verify(token, publicKey);
		  return { payload: verified, expired: false };
	  } catch(error) {
		  console.error(error);
		  return { payload: null, expired: true }
	  }
	}
}