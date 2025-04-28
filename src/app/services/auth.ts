import {
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  NotAuthorizedException,
  UserNotConfirmedException,
  UsernameExistsException,
  CodeMismatchException,
  ExpiredCodeException,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, COGNITO_CONFIG } from "../config/cognito";

export class AuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: COGNITO_CONFIG.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);
    return {
      token: response.AuthenticationResult?.AccessToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
      expiresIn: response.AuthenticationResult?.ExpiresIn,
    };
  } catch (error) {
    if (error instanceof NotAuthorizedException) {
      throw new AuthError("InvalidCredentials", "Email o contraseña incorrectos");
    }
    if (error instanceof UserNotConfirmedException) {
      throw new AuthError("UserNotConfirmed", "Por favor, confirma tu cuenta");
    }
    throw new AuthError("Unknown", "Error al iniciar sesión");
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const command = new SignUpCommand({
      ClientId: COGNITO_CONFIG.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    });

    await cognitoClient.send(command);
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      throw new AuthError("EmailExists", "Este email ya está registrado");
    }
    throw new AuthError("Unknown", "Error al registrar usuario");
  }
};

export const confirmSignUp = async (email: string, code: string) => {
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: COGNITO_CONFIG.clientId,
      Username: email,
      ConfirmationCode: code,
    });

    await cognitoClient.send(command);
  } catch (error) {
    if (error instanceof CodeMismatchException) {
      throw new AuthError("InvalidCode", "Código de confirmación inválido");
    }
    if (error instanceof ExpiredCodeException) {
      throw new AuthError("ExpiredCode", "El código ha expirado");
    }
    throw new AuthError("Unknown", "Error al confirmar cuenta");
  }
};

export const resendConfirmationCode = async (email: string) => {
  try {
    const command = new ResendConfirmationCodeCommand({
      ClientId: COGNITO_CONFIG.clientId,
      Username: email,
    });

    await cognitoClient.send(command);
  } catch (error) {
    throw new AuthError("Unknown", "Error al reenviar código");
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const command = new ForgotPasswordCommand({
      ClientId: COGNITO_CONFIG.clientId,
      Username: email,
    });

    await cognitoClient.send(command);
  } catch (error) {
    throw new AuthError("Unknown", "Error al procesar solicitud");
  }
};

export const confirmForgotPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  try {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: COGNITO_CONFIG.clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });

    await cognitoClient.send(command);
  } catch (error) {
    if (error instanceof CodeMismatchException) {
      throw new AuthError("InvalidCode", "Código inválido");
    }
    if (error instanceof ExpiredCodeException) {
      throw new AuthError("ExpiredCode", "El código ha expirado");
    }
    throw new AuthError("Unknown", "Error al restablecer contraseña");
  }
}; 