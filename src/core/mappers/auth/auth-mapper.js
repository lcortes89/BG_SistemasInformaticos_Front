// LoginResponseDTO -> SessionModel fields
export const authMapper = {
  token: (dto) => dto.token,
  email: (dto) => dto.email,
  role: (dto) => dto.role,
}
