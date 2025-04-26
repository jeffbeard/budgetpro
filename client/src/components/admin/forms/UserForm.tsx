import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertUserSchema, type User } from '@shared/schema';
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

// Enhanced validation schema
const userFormSchema = insertUserSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  initials: z.string().max(5).optional(),
  title: z.string().max(100).optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  data?: User;
  onSubmit: (data: UserFormData) => void;
  isUpdate: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  data, onSubmit, isUpdate
}) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: data ? {
      name: data.name,
      username: data.username,
      password: '',  // Always empty for security
      title: data.title || undefined,
      initials: data.initials || undefined,
    } : {
      name: '',
      username: '',
      password: '',
      initials: '',
      title: '',
    },
  });

  const handleSubmit = (formData: UserFormData) => {
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isUpdate ? 'New Password (leave blank to keep current)' : 'Password'}</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder={isUpdate ? 'Leave blank to keep current' : 'Password'} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Project Manager" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="initials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initials</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="JD" 
                    maxLength={5} 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting 
              ? 'Saving...' 
              : isUpdate ? 'Update User' : 'Create User'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;