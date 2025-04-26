import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertResourceAllocationSchema, type ResourceAlloc } from '@shared/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Enhanced validation schema
const resourceFormSchema = insertResourceAllocationSchema.extend({
  department: z.string().min(2, 'Department must be at least 2 characters').max(50),
  allocation: z.coerce.number().min(0, 'Allocation cannot be negative').max(100, 'Allocation cannot exceed 100%'),
  color: z.string().min(1, 'Color is required'),
});

type ResourceFormData = z.infer<typeof resourceFormSchema>;

interface ResourceFormProps {
  data?: ResourceAlloc;
  onSubmit: (data: ResourceFormData) => void;
  isUpdate: boolean;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ 
  data, onSubmit, isUpdate 
}) => {
  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: data ? {
      ...data,
    } : {
      department: '',
      allocation: 0,
      color: 'bg-blue-500',
    },
  });

  const handleSubmit = (formData: ResourceFormData) => {
    onSubmit(formData);
  };

  const colorOptions = [
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-orange-500', label: 'Orange' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-gray-500', label: 'Gray' },
    { value: 'bg-success', label: 'Success Green' },
    { value: 'bg-warning', label: 'Warning Yellow' },
    { value: 'bg-accent', label: 'Accent Blue' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Development" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allocation (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  max="100"
                  placeholder="50" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${field.value}`}></div>
                      <SelectValue placeholder="Select a color" />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.value}`}></div>
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting 
              ? 'Saving...' 
              : isUpdate ? 'Update Resource' : 'Create Resource'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResourceForm;