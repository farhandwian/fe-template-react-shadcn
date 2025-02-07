import { number, z } from "zod";

export const BaseResponseSchema = z.object({
  status: z.enum(["success", "error"]),
  error: z.string().optional().nullable(),
  metadata: z
    .object({
      // anything
      pagination: z
        .object({
          page: z.number(),
          limit: z.number(),
          total_pages: z.number(),
          total_items: z.number(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email("Mohon Masukkan Alamat Email yang Valid"),
  password: z.string().min(6, "Mohon Masukkan Kata Sandi"),
});

export const LoginResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const LoginOTPRequestSchema = z.object({
  email: z.string().email("Mohon Masukkan Alamat Email yang Valid"),
  otp: z.string().min(6, "Mohon Masukkan OTP"),
});

export const LoginOTPResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    refresh_token: z.string(),
    access_token: z.string(),
  }),
});

export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string(),
});

export const RefreshTokenResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    access_token: z.string(),
  }),
});

export const RegisterUserRequestSchema = z.object({
  name: z.string().min(1, "Mohon Masukkan Nama"),
  email: z.string().email("Mohon Masukkan Alamat Email yang Valid"),
  phone_number: z.string().min(1, "Mohon Masukkan Nomor Telepon"),
});

export const RegisterUserResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    user_id: z.string(),
  }),
});

export const LogoutRequestSchema = z.object({}).optional();

export const LogoutResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const InitiateChangePasswordRequestSchema = z.object({});

export const InitiateChangePasswordResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const ChangePasswordRequestSchema = z
  .object({
    old_password: z.string(),
    new_password: z.string(),
    confirm_new_password: z.string(),
    otp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.new_password !== data.confirm_new_password) {
      // add issue to confirm_new_password field
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kata Sandi Tidak Cocok",
        path: ["confirm_new_password"],
      });
    }
  });

export const ChangePasswordResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const InitiateChangePinRequestSchema = z.object({});
export const InitiateChangePinResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const VerifyChangePinRequestSchema = z
  .object({
    new_pin: z.string(),
    confirm_new_pin: z.string(),
    otp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.new_pin !== data.confirm_new_pin) {
      // add issue to confirm_new_pin field
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PIN Tidak Cocok",
        path: ["confirm_new_pin"],
      });
    }
  });

export const VerifyChangePinResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

// USER SCHEMA
// =============================================================================
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone_number: z.string(),
  email: z.string(),
  email_verified: z.string(),
  enabled: z.boolean(),
  user_access: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetMeRequestSchema = z.object({}).optional();

export const GetMeResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    User: UserSchema,
  }),
});

export const GetUserListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  user_id: z.string().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  name_like: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetUserListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    count: z.number(),
    items: z.array(UserSchema),
  }),
});

export const GetUserRequestSchema = z.object({
  id: z.string(),
});

export const GetUserResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    User: UserSchema,
  }),
});

export const GetUserAccessListRequestSchema = z.object({
  id: z.string(),
});

export const GetUserAccessListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    accesses: z.array(
      z.object({
        id: z.string(),
        description: z.string(),
        group: z.string(),
        type: z.string(),
        enabled: z.boolean(),
      })
    ),
  }),
});

export const AssignUserAccessRequestSchema = z.object({
  id: z.string(),
  accesses: z.array(z.string()),
});

export const AssignUserAccessResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const InitiatePasswordResetRequestSchema = z.object({
  user_id: z.string(),
});

export const InitiatePasswordResetResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const ActivateAccountInitiateRequestSchema = z.object({
  user_id: z.string(),
});

export const ActivateAccountInitiateResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

// AI CONFIGURATION SCHEMA
// =============================================================================
export const DictionarySchema = z.record(z.string());

export const GetDictionariesRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  keyword: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetDictionariesResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    assets: DictionarySchema,
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const AddDictionaryRequestSchema = z.object({
  key: z.string().min(1, "Mohon Masukkan Judul"),
  value: z.string().min(1, "Mohon Masukkan Deskripsi"),
});

export const AddDictionaryResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const DeleteDictionarRequestSchema = z.object({
  key: z.string(),
});

export const DeleteDictionaryResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const EditDictionaryRequestSchema = z.object({
  key: z.string().min(1, "Mohon Masukkan Judul"),
  value: z.string().min(1, "Mohon Masukkan Deskripsi"),
})

export const EditDictionaryResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
})

export const GetDictionaryByIdRequestSchema = z.object({
  id: z.string(),
});

export const GetDictionaryByIdResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  file_path: z.string(),
});

export const GetDocumentsRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  keyword: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetDocumentsResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    assets: z.record(DocumentSchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const AddDocumentRequestSchema = z.object({
  name: z.string().min(1, { message: "Nama tidak boleh kosong" }),
  file: z
    .instanceof(File, { message: "Pilih file pdf" })
    .refine((file) => file.type === "application/pdf", {
      message: "Hanya file PDF yang diizinkan",
    }),
});

export const EditDocumentRequestSchema = z.object({
  name: z.string().min(1, { message: "Nama tidak boleh kosong" }),
});

export const AddDocumentResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const GetDocumentByIdRequestSchema = z.object({
  id: z.string(),
});

export const GetDocumentByIdResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    name: z.string(),
    file: z.string(),
  }),
});

// MASTER DATA SCHEMA
// =============================================================================
//ASSET
export const AssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  pic: z.string(),
  status: z.string(),
});

export const GetAssetListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  keyword: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetAssetListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    assets: z.array(AssetSchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const GetAssetRequestSchema = z.object({
  id: z.string(),
});

export const GetAssetResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    asset: AssetSchema,
  }),
});

export const AddAssetRequestSchema = z.object({
  location: z.string().min(1, "Mohon Masukkan Lokasi"),
  name: z.string().min(1, "Mohon Masukkan Nama Asset"),
  pic: z.string().min(1, "Mohon Masukkan Penanggungjawab"),
});

export const AddAssetResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const DeleteAssetRequestSchema = z.object({
  id: z.string(),
});

export const DeleteAssetResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const EditAssetRequestSchema = z.object({
  id: z.string(),
  location: z.string().min(1, "Mohon Masukkan Lokasi"),
  name: z.string().min(1, "Mohon Masukkan Nama Asset"),
  pic: z.string().min(1, "Mohon Masukkan Penanggungjawab"),
  status: z.string().min(1, "Mohon Masukkan Status"),
});

export const EditAssetResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

// Projects
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  budget: z.number(),
  status: z.string(),
});

export const GetProjectListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  keyword: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetProjectListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    projects: z.array(ProjectSchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const GetProjectRequestSchema = z.object({
  id: z.string(),
});

export const GetProjectResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    project: ProjectSchema,
  }),
});

export const AddProjectRequestSchema = z.object({
  name: z.string().min(1, "Mohon Masukkan Nama Project"),
  budget: z.number().min(1, "Mohon Masukkan Budget"),
});

export const AddProjectResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const DeleteProjectRequestSchema = z.object({
  id: z.string(),
});

export const DeleteProjectResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const EditProjectRequestSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Mohon Masukkan Nama Project"),
  budget: z.number().min(1, "Mohon Masukkan Budget"),
  status: z.string().min(1, "Mohon Masukkan Status"),
});

export const EditProjectResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

// JDIH
export const JDIHSchema = z.object({
  id: z.string(),
  Title: z.string(),
  PublishedAt: z.string(),
  Status: z.string(),
});

export const GetJDIHListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  keyword: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetJDIHListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    jdih: z.array(JDIHSchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const GetJDIHRequestSchema = z.object({
  id: z.string(),
});

export const GetJDIHResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    jdih: JDIHSchema,
  }),
});

export const AddJDIHRequestSchema = z.object({
  title: z.string().min(1, "Mohon Masukkan Judul"),
  published_at: z.string().min(1, "Mohon Masukkan Tanggal Terbit"),
  status: z.string().min(1, "Mohon Masukkan Status"),
});

export const AddJDIHResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const DeleteJDIHRequestSchema = z.object({
  id: z.string(),
});

export const DeleteJDIHResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const EditJDIHRequestSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Mohon Masukkan Judul"),
  status: z.string().min(1, "Mohon Masukkan Status"),
});

export const EditJDIHResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

// Employees
export const EmployeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  joined_date: z.string(),
  status: z.string(),
});

export const GetEmployeeListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  keyword: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetEmployeeListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    employees: z.array(EmployeeSchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const GetEmployeeRequestSchema = z.object({
  id: z.string(),
});

export const GetEmployeeResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    employee: EmployeeSchema,
  }),
});

export const AddEmployeeRequestSchema = z.object({
  name: z.string().min(1, "Mohon Masukkan Nama"),
  role: z.string().min(1, "Mohon Masukkan Role"),
  joined_date: z.string().min(1, "Mohon Masukkan Tanggal Bergabung"),
});

export const AddEmployeeResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const DeleteEmployeeRequestSchema = z.object({
  id: z.string(),
});

export const DeleteEmployeeResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const EditEmployeeRequestSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Mohon Masukkan Nama"),
  role: z.string().min(1, "Mohon Masukkan Role"),
  status: z.string().min(1, "Mohon Masukkan Status"),
});

export const EditEmployeeResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

// Permits
export const PermitSchema = z.object({
  id: z.string(),
  tanggal_sk: z.string(),
  no_sk: z.string(),
  periode_sk: z.string(),
  status: z.string(),
});

export const GetPermitListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  keyword: z.string().optional(),
});

// export const GetPermitListResponseSchema = z.object({
//   ...BaseResponseSchema.shape,
//   data: z.object({
//     permits: z.array(PermitSchema),
//     metadata: z.object({
//       pagination: z.object({
//         page: z.number(),
//         limit: z.number(),
//         total_pages: z.number(),
//         total_items: z.number(),
//       }),
//     }),
//   }),
// });

export const GetPermitListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    items: z.array(
      z.object({
        no_sk: z.string(),
        periode_pengambilan_sda: z.string(),
        updated_at: z.string(),
        koordinat_di_lapangan: z.object({
          type: z.string(),
          coordinates: z.tuple([z.number(), z.number()]),
        }),
      })
    ),
    count: z.number(),
  }),
});

export const GetPermitRequestSchema = z.object({
  id: z.string(),
});

export const GetPermitResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    permit: PermitSchema,
  }),
});

export const AcceptPermitRequestSchema = z.object({
  id: z.string(),
});

export const AcceptPermitResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const RejectPermitRequestSchema = z.object({
  id: z.string(),
});

export const RejectPermitResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

// INFRASTRUCTURES SCHEMA
// =============================================================================

const CoordinatesSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

const PropertiesSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string().optional(),
});

const FeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: CoordinatesSchema,
  properties: PropertiesSchema,
});

const FeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(FeatureSchema),
});

const DetailsSchema = z.object({
  id: z.string(),
  geometry: CoordinatesSchema,
  das_id: z.string(),
  das_name: z.string(),
  is_pupr: z.boolean(),
  intake_object: z.string(),
  province: z.string(),
  city: z.string(),
  district: z.string(),
  sub_district: z.string(),
  authority: z.string(),
  name: z.string(),
  manager_id: z.number(),
  manager_name: z.string(),
  ref_id: z.string(),
  ws_id: z.string(),
  ws_name: z.string(),
  type_id: z.number(),
  type_name: z.string(),
});

export const GetIntakesResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    intakes: FeatureCollectionSchema,
  }),
});

export const GetIntakeRequestSchema = z.object({
  id: z.string(),
});

export const GetIntakeResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: DetailsSchema,
});

const CoastalProtectionDetailsSchema = z.object({
  authority: z.string().nullable(),
  city: z.string().nullable(),
  das_id: z.string().nullable(),
  das_name: z.string().nullable(),
  district: z.string().nullable(),
  geometry: CoordinatesSchema.nullable(),
  id: z.string().nullable(),
  is_pupr: z.boolean().nullable(),
  manager_id: z.number().nullable(),
  manager_name: z.string().nullable(),
  name: z.string().nullable(),
  province: z.string().nullable(),
  ref_id: z.string().nullable(),
  sub_district: z.string().nullable(),
  type_id: z.number().nullable(),
  type_name: z.string().nullable(),
  ws_id: z.string().nullable(),
  ws_name: z.string().nullable(),
});

export const GetCoastalProtectionsResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    coastal_protections: FeatureCollectionSchema,
  }),
});

export const GetCoastalProtectionRequestSchema = z.object({
  id: z.string(),
});

export const GetCoastalProtectionResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: CoastalProtectionDetailsSchema,
});

const DamDetailsSchema = z.object({
  authority: z.string().nullable(),
  city: z.string().nullable(),
  das_id: z.string().nullable(),
  das_name: z.string().nullable(),
  district: z.string().nullable(),
  geometry: CoordinatesSchema.nullable(),
  id: z.string().nullable(),
  is_pupr: z.boolean().nullable(),
  manager_id: z.number().nullable(),
  manager_name: z.string().nullable(),
  name: z.string().nullable(),
  province: z.string().nullable(),
  reference_id: z.string().nullable(),
  sub_district: z.string().nullable(),
  type_id: z.number().nullable(),
  type_name: z.string().nullable(),
  ws_id: z.string().nullable(),
  ws_name: z.string().nullable(),
  dmi: z.number().nullable(),
  dam_peak_elevation: z.number().nullable(),
  irrigation: z.number().nullable(),
  dam_type_description: z.string().nullable(),
  building_condition: z.string().nullable(),
  dam_width: z.number().nullable(),
  peak_dam_width: z.number().nullable(),
  min_inundation_area: z.number().nullable(),
  normal_inundation_area: z.number().nullable(),
  total_inundation_area: z.number().nullable(),
  dam_length: z.number().nullable(),
  peak_dam_length: z.number().nullable(),
  spillway_with_gate: z.string().nullable(),
  spillway_crest_elevation: z.number().nullable(),
  spillway_width: z.number().nullable(),
  spillway_crest_width: z.number().nullable(),
  spillway_length: z.number().nullable(),
  spillway_transition_channel_length: z.number().nullable(),
  spillway_channel: z.string().nullable(),
  spillway_type: z.string().nullable(),
  spillway_type_description: z.string().nullable(),
  flood_reduction_volume: z.number().nullable(),
  flood_reduction_inundation_area: z.number().nullable(),
  hydropower_plant: z.number().nullable(),
  infrastructure_status: z.string().nullable(),
  construction_year: z.string().nullable(),
  dam_height: z.number().nullable(),
  excavation_base_height: z.number().nullable(),
  river_base_height: z.number().nullable(),
  dam_type: z.string().nullable(),
  dam_volume: z.number().nullable(),
  min_reservoir_volume: z.number().nullable(),
  normal_reservoir_volume: z.number().nullable(),
  total_reservoir_volume: z.number().nullable(),
});

export const GetDamsResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    dams: FeatureCollectionSchema,
  }),
});

export const GetDamRequestSchema = z.object({
  id: z.string(),
});

export const GetDamResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: DamDetailsSchema,
});

const GroundwaterDetailsSchema = z.object({
  authority: z.string().nullable(),
  city: z.string().nullable(),
  das_id: z.string().nullable(),
  das_name: z.string().nullable(),
  district: z.string().nullable(),
  geometry: CoordinatesSchema.nullable(),
  id: z.string().nullable(),
  is_pupr: z.boolean().nullable(),
  manager_id: z.number().nullable(),
  manager_name: z.string().nullable(),
  name: z.string().nullable(),
  province: z.string().nullable(),
  ref_id: z.string().nullable(),
  sub_district: z.string().nullable(),
  type_id: z.number().nullable(),
  type_name: z.string().nullable(),
  ws_id: z.string().nullable(),
  ws_name: z.string().nullable(),
});

export const GetGroundwatersResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    ground_waters: FeatureCollectionSchema,
  }),
});

export const GetGroundwaterRequestSchema = z.object({
  id: z.string(),
});

export const GetGroundwaterResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: GroundwaterDetailsSchema,
});

const LakeDetailsSchema = z.object({
  authority: z.string().nullable(),
  city: z.string().nullable(),
  das_id: z.string().nullable(),
  das_name: z.string().nullable(),
  district: z.string().nullable(),
  geometry: CoordinatesSchema.nullable(),
  id: z.string().nullable(),
  is_pupr: z.boolean().nullable(),
  manager_id: z.number().nullable(),
  manager_name: z.string().nullable(),
  name: z.string().nullable(),
  province: z.string().nullable(),
  ref_id: z.string().nullable(),
  sub_district: z.string().nullable(),
  type_id: z.number().nullable(),
  type_name: z.string().nullable(),
  ws_id: z.string().nullable(),
  ws_name: z.string().nullable(),
});

export const GetLakesResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    lakes: FeatureCollectionSchema,
  }),
});

export const GetLakeRequestSchema = z.object({
  id: z.string(),
});

export const GetLakeResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: LakeDetailsSchema,
});

const PahAbsahDetailsSchema = z.object({
  authority: z.string().nullable(),
  city: z.string().nullable(),
  das_id: z.string().nullable(),
  das_name: z.string().nullable(),
  district: z.string().nullable(),
  geometry: CoordinatesSchema.nullable(),
  id: z.string().nullable(),
  is_pupr: z.boolean().nullable(),
  manager_id: z.number().nullable(),
  manager_name: z.string().nullable(),
  name: z.string().nullable(),
  province: z.string().nullable(),
  ref_id: z.string().nullable(),
  sub_district: z.string().nullable(),
  type_id: z.number().nullable(),
  type_name: z.string().nullable(),
  ws_id: z.string().nullable(),
  ws_name: z.string().nullable(),
});

export const GetPahAbsahsResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    pah_absahs: FeatureCollectionSchema,
  }),
});

export const GetPahAbsahRequestSchema = z.object({
  id: z.string(),
});

export const GetPahAbsahResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: PahAbsahDetailsSchema,
});

const RawWaterDetailsSchema = z.object({
  authority: z.string().nullable(),
  city: z.string().nullable(),
  das_id: z.string().nullable(),
  das_name: z.string().nullable(),
  district: z.string().nullable(),
  geometry: CoordinatesSchema.nullable(),
  id: z.string().nullable(),
  is_pupr: z.boolean().nullable(),
  manager_id: z.number().nullable(),
  manager_name: z.string().nullable(),
  name: z.string().nullable(),
  province: z.string().nullable(),
  ref_id: z.string().nullable(),
  sub_district: z.string().nullable(),
  type_id: z.number().nullable(),
  type_name: z.string().nullable(),
  ws_id: z.string().nullable(),
  ws_name: z.string().nullable(),
});

export const GetRawWatersResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    raw_waters: FeatureCollectionSchema,
  }),
});

export const GetRawWaterRequestSchema = z.object({
  id: z.string(),
});

export const GetRawWaterResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: RawWaterDetailsSchema,
});

const SedimentControlDetailsSchema = z.object({
  authority: z.string().nullable(),
  city: z.string().nullable(),
  das_id: z.string().nullable(),
  das_name: z.string().nullable(),
  district: z.string().nullable(),
  geometry: CoordinatesSchema.nullable(),
  id: z.string().nullable(),
  is_pupr: z.boolean().nullable(),
  manager_id: z.number().nullable(),
  manager_name: z.string().nullable(),
  name: z.string().nullable(),
  province: z.string().nullable(),
  ref_id: z.string().nullable(),
  sub_district: z.string().nullable(),
  type_id: z.number().nullable(),
  type_name: z.string().nullable(),
  ws_id: z.string().nullable(),
  ws_name: z.string().nullable(),
});

export const GetSedimentControlsResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    sediment_controls: FeatureCollectionSchema,
  }),
});

export const GetSedimentControlRequestSchema = z.object({
  id: z.string(),
});

export const GetSedimentControlResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: SedimentControlDetailsSchema,
});

const WaterReservoirDetailsSchema = z.object({
  authority: z.string().nullable(),
  body_volume: z.number().nullable(),
  city: z.string().nullable(),
  das_id: z.string().nullable(),
  das_name: z.string().nullable(),
  district: z.string().nullable(),
  foundation_river_height: z.number().nullable(),
  foundation_water_reservoir_height: z.number().nullable(),
  geometry: CoordinatesSchema.nullable(),
  id: z.string().nullable(),
  is_pupr: z.boolean().nullable(),
  manager_id: z.number().nullable(),
  manager_name: z.string().nullable(),
  name: z.string().nullable(),
  province: z.string().nullable(),
  ref_id: z.string().nullable(),
  sub_district: z.string().nullable(),
  type_id: z.number().nullable(),
  water_reservoir_body_type: z.string().nullable(),
  water_reservoir_length: z.number().nullable(),
  water_reservoir_type: z.string().nullable(),
  water_reservoir_width: z.number().nullable(),
  water_surface_elevation: z.number().nullable(),
  water_surface_elevation_max: z.number().nullable(),
  water_surface_elevation_min: z.number().nullable(),
  water_surface_elevation_norma: z.number().nullable(),
  water_surface_elevation_peak: z.number().nullable(),
  ws_id: z.string().nullable(),
  ws_name: z.string().nullable(),
});

export const GetWaterReservoirsResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    water_reservoirs: FeatureCollectionSchema,
  }),
});

export const GetWaterReservoirRequestSchema = z.object({
  id: z.string(),
});

export const GetWaterReservoirResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: WaterReservoirDetailsSchema,
});

const WeirDetailsSchema = z.object({
  authority: z.string().nullable(),
  city: z.string().nullable(),
  das_id: z.string().nullable(),
  das_name: z.string().nullable(),
  debit_intake_dry_season: z.number().nullable(),
  debit_intake_rain_season: z.number().nullable(),
  district: z.string().nullable(),
  geometry: CoordinatesSchema.nullable(),
  id: z.string().nullable(),
  is_pupr: z.boolean().nullable(),
  manager_id: z.number().nullable(),
  manager_name: z.string().nullable(),
  name: z.string().nullable(),
  province: z.string().nullable(),
  ref_id: z.string().nullable(),
  sub_district: z.string().nullable(),
  type_id: z.number().nullable(),
  type_name: z.string().nullable(),
  weir_height: z.number().nullable(),
  weir_type: z.string().nullable(),
  ws_id: z.string().nullable(),
  ws_name: z.string().nullable(),
});

export const GetWeirsResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    weirs: FeatureCollectionSchema,
  }),
});

export const GetWeirRequestSchema = z.object({
  id: z.string(),
});

export const GetWeirResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: WeirDetailsSchema,
});

const WellDetailsSchema = z.object({
  authority: z.string().nullable(),
  city: z.string().nullable(),
  das_id: z.string().nullable(),
  das_name: z.string().nullable(),
  district: z.string().nullable(),
  geometry: CoordinatesSchema.nullable(),
  id: z.string().nullable(),
  is_pupr: z.boolean().nullable(),
  manager_id: z.number().nullable(),
  manager_name: z.string().nullable(),
  name: z.string().nullable(),
  province: z.string().nullable(),
  ref_id: z.string().nullable(),
  sub_district: z.string().nullable(),
  type_id: z.number().nullable(),
  type_name: z.string().nullable(),
  ws_id: z.string().nullable(),
  ws_name: z.string().nullable(),
});

export const GetWellsResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    wells: FeatureCollectionSchema,
  }),
});

export const GetWellRequestSchema = z.object({
  id: z.string(),
});

export const GetWellResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: WellDetailsSchema,
});

// SIHKA SCHEMA
// =============================================================================
//Hydrology - Rainfall
export const RainfallSchema = z.object({
  id: z.string(),
  external_id: z.number(),
  name: z.string(),
  officer: z.string(),
  // whatsapp_number: z.string(),
  city: z.string(),
  manual: z.number().nullable(),
  telemetry: number(),
  attendance_data: z.number(),
  vendor: z.string(),
  // morning: z.number(),
  // afternoon: z.number(),
  // evening: z.number(),
  // dawn: z.number(),
  latest_update: z.string(),
});

export const GetRainfallListRequestSchema = z.object({
  page: z.number().optional(),
  page_size: z.number().optional(),
  keyword: z.string().optional(),
  date: z.string().optional(),
  telemetry: z.number().optional(),
  vendor: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
  city: z.string().optional(),
});

export const GetRainfallListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    date: z.string(),
    rainfall_posts: z.array(RainfallSchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const GetRainfallRequestSchema = z.object({
  id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
});

export const GetRainfallResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    start_date: z.string(),
    end_date: z.string(),
    id: z.string(),
    external_id: z.number(),
    name: z.string(),
    rainfall_post: z.object({
      telemetry: z.object({
        vendor: z.string(),
        rainfall: z.number(),
        latest_update: z.string(),
      }),
      manual: z.object({
        officer: z.string(),
        rainfall: z.nullable(z.number()),
        latest_update: z.string(),
      }),
      graph: z.object({
        detail: z.array(
          z.object({
            hour: z.number(),
            rain: z.number(),
            timestamp: z.string(),
          })
        ),
      }),
    }),
  }),
});

//Hydrology - Climatology
export const ClimatologySchema = z.object({
  id: z.string(),
  external_id: z.number(),
  name: z.string(),
  rainfall: z.number(),
  minimum_temperature: z.number(),
  maximum_temperature: z.number(),
  humidity: z.number(),
  wind_speed: z.number(),
  wind_direction: z.number(),
  sunshine_duration: z.number(),
});

export const GetClimatologyListRequestSchema = z.object({
  page: z.number().optional(),
  page_size: z.number().optional(),
  keyword: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetClimatologyListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    total: z.number(),
    climatology: z.array(ClimatologySchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

//Hydrology - Water Level
export const WaterLevelSchema = z.object({
  id: z.string(),
  external_id: z.number(),
  name: z.string(),
  river: z.string(),
  officer: z.string(),
  manual: z.number().nullable(),
  telemetry: number(),
  latest_update: z.string(),
});

export const GetWaterLevelListRequestSchema = z.object({
  page: z.number().optional(),
  page_size: z.number().optional(),
  keyword: z.string().optional(),
  date: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
  river: z.string().optional(),
});

export const GetWaterLevelListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    date: z.string(),
    water_level_posts: z.array(WaterLevelSchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const GetWaterLevelRequestSchema = z.object({
  id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
});

export const GetWaterLevelResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    start_date: z.string(),
    end_date: z.string(),
    name: z.string(),
    affected_area: z.array(z.any()),
    telemetry: z.object({
      tma_maximum: z.number(),
      tma_minimum: z.number(),
      latest_update: z.string(), // Format datetime string (contoh: "2024-11-13T11:30:06")
    }),
    manual: z.object({
      officer: z.string(),
      latest_update: z.string(),
    }),
    graph: z.object({
      combined_data_point: z.array(
        z.object({
          date: z.string(),
          telemetry: z.number().optional(),
          manual: z.number().optional(),
          water_level_post_id: z.number(),
        })
      ),
    }),
  }),
});

//Water Quality
export const WaterQualitySchema = z.object({
  id: z.string(),
  external_id: z.number(),
  name: z.string(),
  river: z.string(),
});

export const GetWaterQualityListRequestSchema = z.object({
  page: z.number().optional(),
  page_size: z.number().optional(),
  keyword: z.string().optional(),
  date: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
  river: z.string().optional(),
});

export const GetWaterQualityListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    date: z.string(),
    water_level_posts: z.array(WaterQualitySchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

// MAP
const MapCoordinatesSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

const MapPropertiesSchema = z.object({
  id: z.string(),
  external_id: z.number().nullable(),
  name: z.string(),
  type: z.string().optional(),
  manual: z.number().nullable().optional(),
  telemetry: number().nullable().optional(),
  rain_category: z.string().optional(),
});

const MapFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: MapCoordinatesSchema,
  properties: MapPropertiesSchema,
});

const MapFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(MapFeatureSchema),
});

// Map  - Water Levels

const MapWaterLevelDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string().optional(),
  officer: z.string(),
  officerWhatsapp: z.string(),
  elevation: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  location: z.string(),
});

export const GetMapWaterLevelsResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    rain_falls: MapFeatureCollectionSchema,
  }),
});

export const GetMapWaterLevelRequestSchema = z.object({
  id: z.string(),
});

export const GetMapWaterLevelResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: MapWaterLevelDetailsSchema,
});

// Map - Rainfalls
const MapRainfallDetailsSchema = z.object({
  id: z.string(),
  external_id: z.number(),
  name: z.string(),
  type: z.string().optional(),
  officer: z.string(),
  officer_whatsapp: z.string(),
  elevation: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  highest_level_date: z.string(),
  highest_level_level: z.number(),
  current_level: z.number(),
  current_level_status: z.string(),
  city: z.string(),
  vendor: z.string(),
});

export const GetMapRainfallsResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    rain_falls: MapFeatureCollectionSchema,
  }),
});

export const GetMapRainfallRequestSchema = z.object({
  id: z.string(),
});

export const GetMapRainfallResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: MapRainfallDetailsSchema,
});

// Map - Climatology
const MapClimatologyDetailsSchema = z.object({
  id: z.string(),
  external_id: z.number(),
  name: z.string(),
  type: z.string().optional(),
  post_vendor: z.string().optional(),
  officer: z.string(),
  elevation: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetMapClimatologiesResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    total: z.number(),
    climatologies: MapFeatureCollectionSchema,
  }),
});

export const GetMapClimatologyRequestSchema = z.object({
  id: z.string(),
});

export const GetMapClimatologyResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: MapClimatologyDetailsSchema,
});

// Map - River Area
const MapRACoordinatesSchema = z.union([
  z.object({
    type: z.literal("LineString"),
    coordinates: z.array(z.tuple([z.number(), z.number()])),
  }),
  z.object({
    type: z.literal("MultiLineString"),
    coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
  }),
]);

const MapRAPropertiesSchema = z.object({
  id: z.string(),
  name: z.string(),
  ordo: z.string(),
  wsp_id: z.string(),
});

const MapRAFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: MapRACoordinatesSchema,
  properties: MapRAPropertiesSchema,
});

const MapRAFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(MapRAFeatureSchema),
});

export const GetMapRiverAreaResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: MapRAFeatureCollectionSchema,
});

// ALARM CONFIG SCHEMA
// =============================================================================
export const AlarmSchema = z.object({
  id: z.string(),
  channel_id: z.number(),
  channel_name: z.string(),
  // door_id: z.number().optional(),
  // door_name: z.string().optional(),
  priority: z.string(),
  metric: z.string(),
  condition_operator: z.string(),
  condition_value: z.number(),
  condition_duration: z.number(),
  condition_unit: z.string(),
  receiver_adam: z.boolean(),
  receiver_hawa: z.boolean(),
  receiver_dashboard: z.boolean(),
  receiver_whatsapps: z.array(z.string()).nullable().default([]).optional(),
  receiver_emails: z.array(z.string()).nullable().default([]).optional(),
});

export const GetAlarmListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  water_channel_door_id: z.number().optional(),
  priority: z.string().optional(),
  metric: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetAlarmListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    alarm_configs: z.array(AlarmSchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const GetAlarmRequestSchema = z.object({
  id: z.string(),
});

export const GetAlarmResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    alarm_config: AlarmSchema,
  }),
});

export const AddAlarmRequestSchema = z.object({
  channel_id: z.number().min(1, "Mohon Pilih Saluran"),
  // door_id: z.number().optional().nullable(),
  priority: z.string().min(1, "Mohon Pilih Prioritas"),
  metric: z.string().min(1, "Mohon Pilih Metrik"),
  condition_operator: z.string().min(1, "Mohon Pilih Operator"),
  condition_value: z.number().min(1, "Mohon Masukkan Nilai"),
  condition_duration: z.number().min(1, "Mohon Masukkan Durasi"),
  condition_unit: z.string().min(1, "Mohon Pilih Unit Durasi"),
  receiver_adam: z.boolean(),
  receiver_hawa: z.boolean(),
  receiver_dashboard: z.boolean(),
  receiver_whatsapps: z.array(z.string()).nullable(),
  receiver_emails: z
    .array(z.string().email("Mohon Masukkan Email yang Valid"))
    .nullable(),
});

export const AddAlarmResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const DeleteAlarmRequestSchema = z.object({
  id: z.string(),
});

export const DeleteAlarmResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const EditAlarmRequestSchema = z.object({
  id: z.string(),
  channel_id: z.number().min(1, "Mohon Pilih Saluran"),
  door_id: z.number().optional().nullable(),
  priority: z.string().min(1, "Mohon Pilih Prioritas"),
  metric: z.string().min(1, "Mohon Pilih Metrik"),
  condition_operator: z.string().min(1, "Mohon Pilih Operator"),
  condition_value: z.number().min(1, "Mohon Masukkan Nilai"),
  condition_duration: z.number().min(1, "Mohon Masukkan Durasi"),
  condition_unit: z.string().min(1, "Mohon Pilih Unit Durasi"),
  receiver_adam: z.boolean(),
  receiver_hawa: z.boolean(),
  receiver_dashboard: z.boolean(),
  receiver_whatsapps: z.array(z.string()).nullable(),
  receiver_emails: z
    .array(z.string().email("Mohon Masukkan Email yang Valid"))
    .nullable(),
});

export const EditAlarmResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const ChannelsSchema = z.object({
  water_channel_door_id: z.number(),
  name: z.string(),
});

export const GetChannelListRequestSchema = z.object({
  keyword: z.string().optional(),
});

export const GetChannelListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    water_channel_doors: z.array(ChannelsSchema),
  }),
});

export const DoorsSchema = z.object({
  door_id: z.number(),
  name: z.string(),
});

export const GetDoorListRequestSchema = z.object({
  water_channel_door_id: z.number().nullable(),
});

export const GetDoorListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    doors: z.array(DoorsSchema),
  }),
});

export const AlarmHistorySchema = z.object({
  id: z.string(),
  channel_id: z.number(),
  channel_name: z.string(),
  // door_id: z.number(),
  // door_name: z.string(),
  priority: z.string(),
  metric: z.string(),
  condition_operator: z.string(),
  condition_value: z.number(),
  condition_duration: z.number(),
  condition_unit: z.string(),
  alarm_config_uid: z.string(),
  created_at: z.string(),
  status: z.string(),
  values: z.number(),
});

export const GetAlarmHistoryListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
  water_channel_door_id: z.number().optional(),
  device_id: z.number().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
  metric: z.string().optional(),
  priority: z.string().optional(),
});

export const GetAlarmHistoryListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    alarm_histories: z.array(AlarmHistorySchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

// DASHBOARD SCHEMA
// =============================================================================
// Ketersediaan Air
export const WaterAvailabilityForecastSchema = z.object({
  id: z.string(),
  required_water: z.number(),
  average_available_water: z.number(),
  max_available_water: z.number(),
  min_available_water: z.number(),
  date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetWaterAvailabilityForecastResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    water_availability_forecast: z.array(WaterAvailabilityForecastSchema),
  }),
});

// Monitor Aktivitas
export const ActivitySchema = z.object({
  id: z.string(),
  user_name: z.string(),
  category: z.string(),
  ActivityTime: z.string(),
  Description: z.string(),
  CreatedAt: z.string(),
  UpdatedAt: z.string(),
});

export const GetActivityListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
});

export const GetActivityListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    activity_monitors: z.array(ActivitySchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

// Ringkasan General Info DI MANGANTI
export const GeneralInfoSchema = z.object({
  agricultural_info: z.string().optional(),
  planted_area: z.string().optional(),
  planting_season: z.string().optional(),
  cropping_pattern: z.string().optional(),
  water_requirement: z.string().optional(),
  water_availability: z.string().optional(),
  historical_chart: z.string().optional(),
  total_sensor_online: z.number().optional(),
  total_sensor_offline: z.number().optional(),
  total_cctv: z.number().optional(),
  total_staff: z.number().optional(),
});

export const GetGeneralInfoResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: GeneralInfoSchema,
});

//Perkiraan Cuaca
export const WeatherForecastSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  status: z.string().optional(),
  temperature: z.string().optional(),
  humidity: z.string().optional(),
  wind_direction: z.string().optional(),
  wind_velocity: z.string().optional(),
  dam_upstream: z.string().optional(),
});

export const GetWeatherForecastRequestSchema = z.object({
  areaId: z.string(),
});

export const GetWeatherForecastResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    weather_forecasts: z.array(WeatherForecastSchema),
    city: z.string(),
    district: z.string(),
    province: z.string(),
    sub_district: z.string(),
  }),
});

export const GetWeatherLocationRequestSchema = z.object({
  name: z.string(),
});

export const GetWeatherLocationResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    location: z
      .array(
        z.object({
          adm4: z.string(),
          province: z.string(),
          City: z.string(),
          district: z.string(),
          sub_district: z.string(),
        })
      )
      .nullable(),
  }),
});

// Chart TMA
export const ChartTMASchema = z.object({
  tma: z.number().optional(),
  time: z.string().optional(),
});

export const GetChartTMARequestSchema = z.object({
  id: z.string().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
});

export const GetChartResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    charts: z.array(ChartTMASchema).nullable(),
  }),
});

// Kondisi Pemenuhan Air Irigasi
export const GetWaterConditionListRequestSchema = z.object({
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetWaterConditionListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    geo_json: z.object({
      features: z.array(
        z.object({
          type: z.string(),
          properties: z.object({
            id: z.number().optional(),
            water_channel_name: z.string().optional(),
            water_channel_door_name: z.string().optional(),
            water_surface_elevation: z.number().optional(),
            actual_debit: z.number().optional(),
            required_debit: z.number().optional(),
            status: z.string().optional(),
          }),
        })
      ),
    }),

    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

// Devices
export const GetDevicesResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    up: z.number(),
    down: z.number(),
    total: z.number(),
  }),
});

// Internet Speed
export const GetInternetSpeedResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    download: z.number(),
    upload: z.number(),
    ping: z.number(),
  }),
});

// Sijagacai
export const GetSijagacaiResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    reported_count: z.number(),
    unreported_count: z.number(),
  }),
});

// Monitoring System
export const GetMonitoringSystemResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    warning_count: z.number(),
    critical_count: z.number(),
  }),
});

// Autonomous Drone
export const GetDronesResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    latest_inspections: z.string(),
    detected_object_count: z.number(),
  }),
});

// Service Status
export const GetServiceStatusResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    services: z.array(
      z.object({
        name: z.string(),
        is_online: z.boolean(),
      })
    ),
  }),
});

// SIJAGACAI SCHEMA
// =============================================================================
// rekomtek/sk
export const RekomtekSchema = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  no_sk: z.string().optional(),
  masa_berlaku_sk: z.string().optional(),
  koordinat_di_dalam_sk: CoordinatesSchema.optional(),
  cara_pengambilan_sda_dalam_sk: z.string().optional(),
  jenis_tipe_konstruksi_dalam_sk: z.string().optional(),
  kuota_air_dalam_sk: z.number().optional(),
  jadwal_pengambilan_dalam_sk: z.string().optional(),
  jadwal_pembangunan_dalam_sk: z.string().optional(),
  ketentuan_teknis_lainnya: z.string().optional(),
  perpanjangan: z.string().optional(),
  tanggal_sk: z.string().optional(),
  jenis_usaha: z.string().optional(),
  kab_kota: z.string().optional(),
  kecamatan: z.string().optional(),
  desa: z.string().optional(),
  sumber_air: z.string().optional(),
  alamat_pemohon: z.string().optional(),
  perusahaan_pemohon: z.string().optional(),
  pemohon: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const GetRekomtekListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  keyword: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetRekomtekListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    items: z.array(RekomtekSchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

// reports
export const ReportSchema = z.object({
  perusahaan: z.string().optional(),
  laporan_perizinan: z
    .object({
      id: z.string().optional(),
      status: z.string().optional(),
      no_sk: z.string().optional(),
      koordinat_di_lapangan: z
        .object({
          type: z.literal("Point"),
          coordinates: z.tuple([z.number(), z.number()]),
        })
        .optional(),
      cara_pengambilan_sda_di_lapangan: z.string().optional(),
      jenis_tipe_konstruksi_di_lapangan: z.string().optional(),
      periode_pengambilan_sda: z.string().optional(),
      debit_pengambilan: z.number().optional(),
      laporan_pengambilan_air_bulanan: z.any().optional(),
      jadwal_pengambilan_di_lapangan: z.string().optional(),
      jadwal_pembangunan_di_lapangan: z.string().optional(),
      tanggal_pemegang_dilarang_mengambil_air: z.string().optional(),
      realisasi_di_lapangan: z.string().optional(),
      laporan_hasil_pemeriksaan_tim_verifikasi: z.any().optional(),
      file_keberadaan_alat_ukur_debit: z.any().optional(),
      file_keberadaan_sistem_telemetri: z.any().optional(),
      terdapat_air_dibuang_ke_sumber: z.boolean().optional(),
      debit_air_buangan: z.number().optional(),
      laporan_hasil_pemeriksaan_buangan: z.any().optional(),
      dokumen_bukti_bayar: z.any().optional(),
      dokumen_kewajiban_keuangan_lainnya: z.any().optional(),
      bukti_kerusakan_sumber_air: z.any().optional(),
      perbaikan_kerusakan: z.boolean().optional(),
      bukti_usaha_pengendalian_pencemaran: z.any().optional(),
      bentuk_usaha_pengendalian: z.string().optional(),
      bukti_penggunaan_air: z.any().optional(),
      debit_air_dihasilkan: z.number().optional(),
      manfaat_untuk_kegiatan: z.string().optional(),
      kegiatan_op: z.string().optional(),
      koordinasi_bbws_rencana_op: z.string().optional(),
      koordinasi_bbws_konstruksi: z.string().optional(),
      pl_debit_yang_digunakan: z.number().optional(),
      pl_kualitas_air_digunakan: z.string().optional(),
      pl_debit_yang_dikembalikan: z.number().optional(),
      pl_kualitas_air_dikembalikan: z.string().optional(),
      created_at: z.string().optional(),
      updated_at: z.string().optional(),
    })
    .optional(),
});

export const GetReportListRequestSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  keyword: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
  periode_pengambilan_sda: z.string().optional(),
});

export const GetReportListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    items: z.array(ReportSchema),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

// OLD

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Mohon Masukkan Kata Sandi Minimal 6 Karakter"),
    confirmPassword: z.string().min(6, "Mohon Konfirmasi Kata Sandi"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kata Sandi Tidak Cocok",
        path: ["confirmPassword"],
      });
    }
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Mohon Masukkan Kata Sandi Lama"),
    newPassword: z
      .string()
      .min(6, "Mohon Masukkan Kata Sandi Baru Minimal 6 Karakter"),
    confirmNewPassword: z.string().min(1, "Mohon Konfirmasi Kata Sandi Baru"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kata Sandi Tidak Cocok",
        path: ["confirmNewPassword"],
      });
    }
  });

export const setPasswordPinSchema = z
  .object({
    password: z.string().min(6, "Mohon Masukkan Kata Sandi"),
    confirmPassword: z.string().min(6, "Mohon Konfirmasi Kata Sandi"),
    pin: z.string().min(4, "Mohon Masukkan PIN"),
    confirmPin: z.string().min(4, "Mohon Konfirmasi PIN"),
  })
  .superRefine((data, ctx) => {
    if (data.pin !== data.confirmPin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PIN Tidak Cocok",
        path: ["confirmPin"],
      });
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kata Sandi Tidak Cocok",
        path: ["confirmPassword"],
      });
    }
  });

export const changePINSchema = z
  .object({
    newPIN: z.string().min(4, "Mohon Masukkan PIN Baru dengan 4 Angka"),
    confirmNewPIN: z.string().min(1, "Mohon Konfirmasi PIN Baru"),
  })
  .superRefine((data, ctx) => {
    if (data.newPIN !== data.confirmNewPIN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PIN Tidak Cocok",
        path: ["confirmNewPIN"],
      });
    }
  });

export const AddDictionarySchema = z.object({
  title: z.string().min(1, "Mohon Masukkan Judul"),
  description: z.string().min(1, "Mohon Masukkan Deskripsi"),
});

export const AddDocumentSchema = z.object({
  name: z.string().min(1, "Mohon Masukkan Nama"),
  file: z.string().min(1, "Mohon Upload File"),
});

export const AddAssetSchema = z.object({
  name: z.string().min(1, "Mohon Masukkan Nama"),
  location: z.string().min(1, "Mohon Masukkan Lokasi"),
});

export const AddConfigSchema = z.object({
  saluran: z.string().min(1, { message: "Saluran harus dipilih" }),
  pintu: z.string().min(1, { message: "Pintu harus dipilih" }),
  metrik: z.string().min(1, { message: "Metrik harus dipilih" }),
  tipe: z.enum(["threshold", "anomaly"]),
  prioritas: z.enum(["peringatan", "kritis"]),
  operator: z.string().min(1, { message: "Operator harus dipilih" }),
  nilai: z.string().min(1, { message: "Nilai harus diisi" }),
  waktu: z.string().min(1, { message: "Waktu harus diisi" }),
  waktuUnit: z.string().min(1, { message: "Unit waktu harus dipilih" }),
  penerima: z
    .array(z.string())
    .min(1, { message: "Pilih minimal satu penerima" }),
  email: z
    .string()
    .email({ message: "Email tidak valid" })
    .optional()
    .or(z.literal("")),
  whatsapp: z
    .string()
    .regex(/^\d+$/, { message: "Nomor WhatsApp tidak valid" })
    .optional()
    .or(z.literal("")),
});

export const GetWaterChannelDoorListRequestSchema = z.object({
  name: z.string().optional(),
  min_water_elevation: z.number().optional(),
  max_water_elevation: z.number().optional(),
  min_actual_debit: z.number().optional(),
  max_actual_debit: z.number().optional(),
  min_required_debit: z.number().optional(),
  max_required_debit: z.number().optional(),
  water_channel_id: z.string().optional(),
  status: z.string().optional(),
  page: z.number(),
  page_size: z.number(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export const GetWaterChannelDoorListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    geo_json: z.object({
      features: z.array(
        z.object({
          type: z.string(),
          properties: z.object({
            id: z.number(),
            water_channel_name: z.string(),
            water_channel_door_name: z.string(),
            water_surface_elevation: z.number(),
            actual_debit: z.number(),
            required_debit: z.number(),
            cctv_count: z.number(),
            officer_count: z.number(),
            status_debit: z.string(),
            status_tma: z.boolean(),
            garbage_detected: z.boolean(),
            human_detected: z.boolean(),
          }),
          geometry: z.object({
            type: z.string(),
            coordinates: z.array(z.number(), z.number()),
          }),
        })
      ),
      type: z.string(),
    }),

    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const GetWaterChannelDoorRequestSchema = z.object({
  id: z.string(),
});

export const GetWaterChannelDoorResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    water_channel_door_name: z.string(),
    water_channel_door_id: z.string(),
    photo_urls: z.array(z.string()).nullable(),
    garbage_detected: z.boolean(),
    officers: z.array(
      z.object({
        name: z.string(),
        photo: z.string(),
        phone_number: z.string(),
        task: z.string(),
      })
    ),
    cctvs: z.array(
      z.object({
        external_id: z.number(),
        name: z.string(),
        ip_address: z.string(),
      })
    ),
  }),
});

export const GetWaterChannelDoorGatesRequestSchema = z.object({
  id: z.string(),
});

export const GetWaterChannelDoorGatesResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    gates: z.array(
      z.object({
        id: z.number(),
        group_relay: z.number(),
        name: z.string(),
        gate_level: z.number(),
        security_relay: z.boolean(),
        sensor: z.boolean(),
        status: z.boolean(),
        run: z.boolean(),
        upper_limit: z.number(),
        lower_limit: z.number(),
      })
    ),
  }),
});

export const GetStatusDebitRequestSchema = z.object({
  id: z.string(),
});

export const GetStatusDebitResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    actual_debit: z.number(),
    debit_requirement: z.number(),
    water_gate_status: z.boolean(),
    water_level: z.number(),
    water_level_status: z.boolean(),
    debit_per_1cm: z.number(),
  }),
});

export const GetDoorControlListRequestSchema = z.object({
  water_channel_door_id: z.number().optional(),
  device_id: z.number().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export const GetDoorControlListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    door_controls: z.array(
      z.object({
        date: z.string(),
        device_id: z.number(),
        error_message: z.string(),
        id: z.string(),
        officer_id: z.string(),
        officer_name: z.string(),
        open_target: z.number(),
        reason: z.string(),
        status: z.string(),
        water_channel_door_id: z.number(),
        door_name: z.string(),
      })
    ),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const GetDoorControlHistoryListRequestSchema = z.object({
  water_channel_door_id: z.number().optional(),
  device_id: z.number().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export const GetDoorControlHistoryListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    door_control_histories: z.array(
      z.object({
        date: z.string(),
        device_id: z.number(),
        door_name: z.string(),
        error_message: z.string(),
        id: z.string(),
        officer_id: z.string(),
        officer_name: z.string(),
        open_current: z.number(),
        open_target: z.number(),
        reason: z.string(),
        status: z.string(),
        type: z.string(),
        water_channel_door_id: z.number(),
      })
    ),
    metadata: z.object({
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total_pages: z.number(),
        total_items: z.number(),
      }),
    }),
  }),
});

export const CreateDoorControlRequestSchema = z.object({
  date: z.string().min(1, "Mohon Masukkan Tanggal"),
  device_id: z.number().min(1, "Mohon Masukkan ID Perangkat"),
  open_target: z.number().min(1, "Mohon Masukkan Target Buka"),
  reason: z.string().min(1, "Mohon Masukkan Alasan"),
  water_channel_door_id: z.number().min(1, "Mohon Masukkan ID Pintu"),
});

export const CreateDoorControlResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const RunDoorControlRequestSchema = z.object({
  // date: z.string().min(1, "Mohon Masukkan Tanggal"),
  device_id: z.number().min(1, "Mohon Masukkan ID Perangkat"),
  open_target: z.number().min(1, "Mohon Masukkan Target Buka"),
  pin: z.string().min(1, "Mohon Masukkan PIN"),
  reason: z.string().min(1, "Mohon Masukkan Alasan"),
  water_channel_door_id: z.number().min(1, "Mohon Masukkan ID Pintu"),
});

export const RunDoorControlResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const DeleteDoorControlRequestSchema = z.object({
  id: z.string().min(1, "Mohon Masukkan ID"),
});

export const DeleteDoorControlResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const GetWaterChannelListRequestSchema = z.object({});

export const GetWaterChannelListResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({
    water_channel: z.array(
      z.object({
        id: z.string(),
        external_id: z.number(),
        name: z.string(),
      })
    ),
  }),
});

export const RunDoorControlSensorRequestSchema = z.object({
  device_id: z.number().min(1, "Mohon Masukkan ID Perangkat"),
  pin: z.string().min(4, "Mohon Masukkan PIN"),
  status: z.number(), // 0: close, 1: open
  water_channel_door_id: z.number().min(1, "Mohon Masukkan ID Pintu"),
});

export const RunDoorControlSensorResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const RunDoorControlSecurityRelayRequestSchema = z.object({
  device_id: z.number().min(1, "Mohon Masukkan ID Perangkat"),
  pin: z.string().min(4, "Mohon Masukkan PIN"),
  status: z.number(), // 0: close, 1: open
  water_channel_door_id: z.number().min(1, "Mohon Masukkan ID Pintu"),
});

export const RunDoorControlSecurityRelayResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: z.object({}),
});

export const GetChartDebitRequestSchema = z.object({
  id: z.string().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
});

export const GetChartDebitResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z
    .object({
      charts: z
        .array(
          z.object({
            time: z.string(),
            debit: z.number(),
          })
        )
        .nullable(),
    })
    .optional(),
});

export const GetChartPintuAirRequestSchema = z.object({
  id: z.string().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
});

export const GetChartPintuAirResponseSchema = z.object({
  status: z.string(),
  error: z.string().nullable(),
  data: z.object({
    charts: z.array(z.any()).nullable(),
  }),
});
