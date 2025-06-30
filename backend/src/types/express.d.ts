import "express-session";
import { UserTokenData } from "../services/allegroService"; // Upewnij się, że ścieżka jest poprawna
import { TokenPayload } from "./auth.types"; // Importuj TokenPayload

declare module "express-session" {
  interface SessionData {
    allegroAuth?: {
      verifier: string;
      state: string;
    };
    allegroTokens?: UserTokenData;
    // Możesz tu dodać inne niestandardowe pola sesji, jeśli będziesz ich potrzebować
    // np. userId?: number;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload; // Dodaj właściwość 'user' do obiektu Request
    }
  }
}

export {};
