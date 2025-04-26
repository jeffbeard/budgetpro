import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertBudgetDataSchema, type BudgetData } from '@shared/schema';
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
const budgetDataFormSchema = insertBudgetDataSchema.extend({
  month: z.string().min(1, 'Month is required'),
  allocated: z.coerce.number().positive('Allocated amount must be positive'),
  spent: z.coerce.number().min(0, 'Spent amount cannot be negative'),
});

type BudgetDataFormData = z.infer<typeof budgetDataFormSchema>;

interface BudgetDataFormProps {
  data?: BudgetData;
  onSubmit: (data: BudgetDataFormData) => void;
  isUpdate: boolean;
}

const BudgetDataForm: React.FC<BudgetDataFormProps> = ({ 
  data, onSubmit, isUpdate 
}) => {
  const form = useForm<BudgetDataFormData>({
    resolver: zodResolver(budgetDataFormSchema),
    defaultValues: data ? {
      ...data,
    } : {
      month: '',
      allocated: 0,
      spent: 0,
    },
  });

  const handleSubmit = (formData: BudgetDataFormData) => {
    onSubmit(formData);
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="allocated"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allocated Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="100000" 
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
                <FormLabel>Spent Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="75000" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
              : isUpdate ? 'Update Budget Data' : 'Create Budget Data'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BudgetDataForm;