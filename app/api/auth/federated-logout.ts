// /api/auth/federated-logout
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from "next-auth/jwt"

export default async function federatedLogout(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getToken({req, secret: process.env.SECRET })
    if (!token) {
      if (process.env.NEXTAUTH_URL) {
        return res.redirect(process.env.NEXTAUTH_URL)
      } else {
        return res.status(500);
      }
    }

    const endsessionURL = `https://${process.env.AUTH0_ISSUER}/oidc/logout`
    const endsessionParams = new URLSearchParams([
      ['id_token_hint', String(token.idToken)],
      ['post_logout_redirect_uri', String(process.env.NEXTAUTH_URL)],
    ]);
    return res.redirect(`${endsessionURL}?${endsessionParams}`)
  } catch (error) {
    if (process.env.NEXTAUTH_URL) {
      res.redirect(process.env.NEXTAUTH_URL)
    } else {
      return res.status(500);
    }
  }
}