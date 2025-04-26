import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertProjectSchema, type Project } from '@shared/schema';
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
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

// Enhanced validation schema
const projectFormSchema = insertProjectSchema.extend({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  status: z.enum(['on track', 'at risk', 'over budget', 'completed']),
  progress: z.coerce.number().min(0).max(100),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  budget: z.coerce.number().positive('Budget must be positive'),
  spent: z.coerce.number().min(0, 'Spent cannot be negative'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  icon: z.string(),
  iconBg: z.string(),
  iconColor: z.string(),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  data?: Project;
  onSubmit: (data: ProjectFormData) => void;
  isUpdate: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  data, onSubmit, isUpdate 
}) => {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: data ? {
      ...data,
      // Convert string dates to Date objects if needed
      startDate: data.startDate instanceof Date ? data.startDate : new Date(data.startDate),
      endDate: data.endDate instanceof Date ? data.endDate : new Date(data.endDate),
      status: (data.status as any) || 'on track',
      icon: data.icon || 'workflow',
      iconBg: data.iconBg || 'bg-blue-500',
      iconColor: data.iconColor || 'text-white',
    } : {
      name: '',
      status: 'on track',
      progress: 0,
      category: '',
      description: '',
      budget: 0,
      spent: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      icon: 'workflow',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
    },
  });

  const handleSubmit = (formData: ProjectFormData) => {
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
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Website Redesign" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Development" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="on track">On Track</SelectItem>
                    <SelectItem value="at risk">At Risk</SelectItem>
                    <SelectItem value="over budget">Over Budget</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Project description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="50000" 
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
            name="spent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spent ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="25000" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="progress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Progress (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  max="100"
                  placeholder="50" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="workflow">Workflow</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="folder">Folder</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="shield">Shield</SelectItem>
                    <SelectItem value="star">Star</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="iconBg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon Background</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bg-blue-500">Blue</SelectItem>
                    <SelectItem value="bg-green-500">Green</SelectItem>
                    <SelectItem value="bg-red-500">Red</SelectItem>
                    <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                    <SelectItem value="bg-purple-500">Purple</SelectItem>
                    <SelectItem value="bg-pink-500">Pink</SelectItem>
                    <SelectItem value="bg-indigo-500">Indigo</SelectItem>
                    <SelectItem value="bg-gray-500">Gray</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="iconColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text-white">White</SelectItem>
                    <SelectItem value="text-black">Black</SelectItem>
                    <SelectItem value="text-blue-100">Light Blue</SelectItem>
                    <SelectItem value="text-green-100">Light Green</SelectItem>
                    <SelectItem value="text-red-100">Light Red</SelectItem>
                    <SelectItem value="text-yellow-100">Light Yellow</SelectItem>
                  </SelectContent>
                </Select>
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
              : isUpdate ? 'Update Project' : 'Create Project'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;