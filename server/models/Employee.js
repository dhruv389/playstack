import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
        'Engineering',
        'Product',
        'Design',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance',
        'Operations',
        'Customer Support',
      ],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      enum: [
        'Intern',
        'Associate',
        'Senior Associate',
        'Team Lead',
        'Manager',
        'Senior Manager',
        'Director',
        'VP',
        'C-Level',
      ],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [1, 'Salary must be greater than 0'],
      max: [100000000, 'Salary looks unrealistic'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    role: {
      type: String,
      enum: ['Super Admin', 'HR Manager', 'Employee'],
      default: 'Employee',
    },
    reportingManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    profileImage: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // Reference to the auth user account (optional, set when account exists)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Auto-generate employeeId before save if not set
employeeSchema.pre('save', async function (next) {
  if (!this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments()
    this.employeeId = `ORB-${1001 + count}`
  }
  next()
})

// Virtual: id as string (matches frontend shape)
employeeSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

employeeSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    // Normalize reportingManagerId to string or null for the frontend
    if (ret.reportingManagerId) {
      ret.reportingManagerId = ret.reportingManagerId.toString()
    }
    delete ret.__v
  },
})

export default mongoose.model('Employee', employeeSchema)
