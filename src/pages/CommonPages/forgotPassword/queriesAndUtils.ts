import { publicRequest } from "../../../api/requestMethods";

export const users = {
  patient: "patients",
  doctor: "doctors",
  admin: "admin",
  pharmacy: "pharmacy",
  lab: "lab",
};

const PATIENT_QUERY = `
query ($email: String!) {
    findPatientByEmail(email: $email) {
      id
    }
  }
`;

export const getPatientByEmail = async (email: string) => {
  const response = await publicRequest.post("/graphql", {
    query: PATIENT_QUERY,
    variables: { email },
  });
  return response.data.data.findPatientByEmail;
};

const DOCTOR_QUERY = `
query ($email: String!) {
    findDoctorByEmail(email: $email) {
      id
    }
  }
`;

export const getDoctorByEmail = async (email: string) => {
  const response = await publicRequest.post("/graphql", {
    query: DOCTOR_QUERY,
    variables: { email },
  });
  return response.data.data.findDoctorByEmail;
};

const ADMIN_QUERY = `
query ($email: String!) {
    findAdminByEmail(email: $email) {
        id
    }
  }
`;

export const getAdminByEmail = async (email: string) => {
  const response = await publicRequest.post("/graphql", {
    query: ADMIN_QUERY,
    variables: { email },
  });
  return response.data.data.findAdminByEmail;
};

const PHARMACY_QUERY = `
query FindPharmacyByEmail($email: String!) {
  findPharmacyByEmail(email: $email) {
  id  
  }
}
`;

export const getPharmacyByEmail = async (email: string) => {
  const response = await publicRequest.post("/graphql", {
    query: PHARMACY_QUERY,
    variables: { email },
  });
  return response.data.data.findPharmacyByEmail;
};

const LAB_QUERY = `
query FindLabByEmail($email: String!) {
  findLabByEmail(email: $email) {
    id
  }
}
`;

export const getLabByEmail = async (email: string) => {
  const response = await publicRequest.post("/graphql", {
    query: LAB_QUERY,
    variables: { email },
  });
  return response.data.data.findLabByEmail;
};

const PATIENT_FORGOT_PASSWORD_QUERY = `
query ($email: String, $id: Int) {
  patientForgotPassword(email: $email, id: $id) {
    id
  }
}
`;

const DOCTOR_FORGOT_PASSWORD_QUERY = `
query ($email: String, $id: Int) {
  doctorForgotPassword(email: $email, id: $id) {
    id
  }
}
`;

const ADMIN_FORGOT_PASSWORD_QUERY = `
query ($email: String, $id: Int) {
  adminForgotPassword(email: $email, id: $id) {
    id
  }
}
`;

const PHARMACY_FORGOT_PASSWORD_QUERY = `
query PharmacyForgotPassword($pharmacyForgotPasswordId: Int, $email: String) {
  pharmacyForgotPassword(id: $pharmacyForgotPasswordId, email: $email) {
id
  }
}
`;

const LAB_FORGOT_PASSWORD_QUERY = `
query LabForgotPassword($email: String, $labForgotPasswordId: Int) {
  labForgotPassword(email: $email, id: $labForgotPasswordId) {
    id
  }
}
`;

export const forgotPassword = async (
  email: string,
  id: number,
  user: string,
) => {
  if (user === users.patient) {
    const response = await publicRequest.post("/graphql", {
      query: PATIENT_FORGOT_PASSWORD_QUERY,
      variables: { email, id },
    });
    return response.data.data.patientForgotPassword;
  } else if (user === users.doctor) {
    const response = await publicRequest.post("/graphql", {
      query: DOCTOR_FORGOT_PASSWORD_QUERY,
      variables: { email, id },
    });
    return response.data.data.doctorForgotPassword;
  } else if (user === users.admin) {
    const response = await publicRequest.post("/graphql", {
      query: ADMIN_FORGOT_PASSWORD_QUERY,
      variables: { email, id },
    });
    return response.data.data.adminForgotPassword;
  } else if (user === users.pharmacy) {
    const response = await publicRequest.post("/graphql", {
      query: PHARMACY_FORGOT_PASSWORD_QUERY,
      variables: { email, pharmacyForgotPasswordId: id },
    });
    return response.data.data.pharmacyForgotPassword;
  } else if (user === users.lab) {
    const response = await publicRequest.post("/graphql", {
      query: LAB_FORGOT_PASSWORD_QUERY,
      variables: { email, labForgotPasswordId: id },
    });
    return response.data.data.labForgotPassword;
  }
};

const PATIENT_VERIFY_CODE_QUERY = `
query ($code: String, $id: Int) {
  verifyPatientCode(code: $code, id: $id)
}
`;

const DOCTOR_VERIFY_CODE_QUERY = `
query ($code: String, $id: Int) {
  verifyDoctorCode(code: $code, id: $id)
}
`;

const ADMIN_VERIFY_CODE_QUERY = `
query ($code: String, $id: Int) {
  verifyAdminCode(code: $code, id: $id)
}
`;

const PHARMACY_VERIFY_CODE_QUERY = `
query Query($code: String, $verifyPharmacyCodeId: Int) {
  verifyPharmacyCode(code: $code, id: $verifyPharmacyCodeId)
}
`;

const LAB_VERIFY_CODE_QUERY = `
query Query($code: String, $verifyLabCodeId: Int) {
  verifyLabCode(code: $code, id: $verifyLabCodeId)
}
`;

export const verifyCode = async (code: string, id: number, user: string) => {
  if (user === users.patient) {
    const response = await publicRequest.post("/graphql", {
      query: PATIENT_VERIFY_CODE_QUERY,
      variables: { code, id },
    });
    return response.data.data.verifyPatientCode;
  } else if (user === users.doctor) {
    const response = await publicRequest.post("/graphql", {
      query: DOCTOR_VERIFY_CODE_QUERY,
      variables: { code, id },
    });
    return response.data.data.verifyDoctorCode;
  } else if (user === users.admin) {
    const response = await publicRequest.post("/graphql", {
      query: ADMIN_VERIFY_CODE_QUERY,
      variables: { code, id },
    });
    return response.data.data.verifyAdminCode;
  } else if (user === users.pharmacy) {
    const response = await publicRequest.post("/graphql", {
      query: PHARMACY_VERIFY_CODE_QUERY,
      variables: { code, verifyPharmacyCodeId: id },
    });
    return response.data.data.verifyPharmacyCode;
  } else if (user === users.lab) {
    const response = await publicRequest.post("/graphql", {
      query: LAB_VERIFY_CODE_QUERY,
      variables: { code, verifyLabCodeId: id },
    });
    return response.data.data.verifyLabCode;
  }
};

const PATIENT_UPDATE_QUERY = `
mutation($id: Int!, $password: String!) {
  updatePatientPassword(id: $id, password: $password) {
    id
  }
}
`;

const DOCTOR_UPDATE_QUERY = `
mutation($id: Int!, $password: String!) {
  updateDoctorPassword(id: $id, password: $password) {
    id
  }
}
`;

const ADMIN_UPDATE_QUERY = `
mutation($id: Int!, $password: String!) {
  updateAdminPassword(id: $id, password: $password) {
    id
  }
}
`;

const PHARMACY_UPDATE_QUERY = `
mutation UpdatePharmacyPassword($updatePharmacyPasswordId: Int!, $password: String!) {
  updatePharmacyPassword(id: $updatePharmacyPasswordId, password: $password) {
    id
  }
}
`;

const LAB_UPDATE_QUERY = `
mutation UpdateLabPassword($updateLabPasswordId: Int!, $password: String!) {
  updateLabPassword(id: $updateLabPasswordId, password: $password) {
    id
  }
}
`;

export const updatePassword = async (
  id: number,
  user: string,
  password: string,
) => {
  if (user === users.patient) {
    const response = await publicRequest.post("/graphql", {
      query: PATIENT_UPDATE_QUERY,
      variables: { id: id, password },
    });
    return response.data.data.updatePatientPassword;
  } else if (user === users.doctor) {
    const response = await publicRequest.post("/graphql", {
      query: DOCTOR_UPDATE_QUERY,
      variables: { id: id, password },
    });
    return response.data.data.updateDoctorPassword;
  } else if (user === users.admin) {
    const response = await publicRequest.post("/graphql", {
      query: ADMIN_UPDATE_QUERY,
      variables: { id: id, password },
    });
    return response.data.data.updateAdminPassword;
  } else if (user === users.pharmacy) {
    const response = await publicRequest.post("/graphql", {
      query: PHARMACY_UPDATE_QUERY,
      variables: { updatePharmacyPasswordId: id, password },
    });
    return response.data.data.updatePharmacyPassword;
  } else if (user === users.lab) {
    const response = await publicRequest.post("/graphql", {
      query: LAB_UPDATE_QUERY,
      variables: { updateLabPasswordId: id, password },
    });
    return response.data.data.updateLabPassword;
  }
};
