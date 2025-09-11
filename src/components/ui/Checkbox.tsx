import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/24/outline'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helperText?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-start">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              className={cn(
                "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2",
                error && "border-red-300 text-red-600 focus:ring-red-500",
                className
              )}
              ref={ref}
              {...props}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckIcon className="h-3 w-3 text-white opacity-0 transition-opacity duration-200 data-[checked]:opacity-100" />
            </div>
          </div>
          {label && (
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              {helperText && (
                <p className="text-sm text-gray-500">{helperText}</p>
              )}
            </div>
          )}
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
