
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client('388822687905-qbmo641qfdjj0li6ucg26kbim9pshe1b.apps.googleusercontent.com');

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: '388822687905-qbmo641qfdjj0li6ucg26kbim9pshe1b.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).json({ message: 'Payload không hợp lệ' });
      return;
    }

    const { email, name, picture, sub } = payload;

    res.json({
      message: 'Đăng nhập thành công',
      user: { email, name, picture },
    });
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
