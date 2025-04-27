import jwt from 'jsonwebtoken';
import axios from '../constants/axios';

export async function getSubscription(uid) {
  try {
    let subscription;
    const { data } = await axios.get(`/api/emo/subscription/${uid}`, {
      headers: {
        authorization: process.env.NEXT_PUBLIC_EMO_DEVELOPER_API_KEY,
      }
    });

    if (data && data.success) {
      subscription = data.subscription;
    } else {
      return null;
    }

    return subscription;
  } catch (error) {
    return null;
  }
}
