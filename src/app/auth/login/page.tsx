 'use client';
 import { useRouter, useSearchParams } from 'next/navigation';
 import { FieldDefinition, FormModel, FormSchema } from "@/components/form/types";
 import { useFormGen } from '@/components/form/useFormGen';
 import { PasswordField } from '@/components/form/fields/PasswordField';
 import { TextField } from '@/components/form/fields/TextField';

 export default function LoginPage() {
     const router = useRouter();
     const searchParams = useSearchParams();
     
     const initialModel: FormModel = {
         username: "",
         password: ""
     };

     const fieldDefinitions: { [key: string]: FieldDefinition } = {
         username: { name: 'username', type: 'text', label: { text: 'Username' }, rules: [{ name: "required" }] },
         password: { name: 'password', type: 'password', label: { text: 'Password' }, rules: [{ name: "required" }] }
     };

     const schema = {
         name: "login-form",
         definitions: Object.values(fieldDefinitions),
     } as FormSchema;
     
     const { model, updateModelValue, handleSubmit, state } = useFormGen({
         model: initialModel,
         schema
     });

     const handleLogin = async(data: FormModel) => {
         const res = await fetch('/api/auth/login', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify(data)
         });

         if (res.status === 200) {
             let returnUrl = searchParams.get('return');
             returnUrl = (returnUrl && decodeURIComponent(returnUrl)) ?? '/';
             router.push(returnUrl);
         };
     };

     const onValid = (data: FormModel) => {
         console.log('valid!', data);
         handleLogin(data);
     };

     const onInvalid = () => {
         console.log('invalid!');
     };

     const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
         e.preventDefault();
         handleSubmit(onValid, onInvalid)(e);
     };

     return (
         <div className="w-full h-dvh flex justify-center items-center bg-zinc-100">
             <div className='w-full mx-2 bg-white rounded p-5 md:w-96'>
                 <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>
                     <h1 className='font-bold text-2xl'>Login</h1>
                     <div>
                         <label>Username</label>
                         <TextField
                             field={fieldDefinitions.username}
                             // @ts-ignore
                             value={model.username ?? ""}
                             path="username"
                             updateModelValue={(path, definition, value) =>
                                 updateModelValue(path, definition, value, true)
                             }
                             onBlur={() =>
                                 updateModelValue("username", fieldDefinitions.username, model.username, true)
                             }
                             autoComplete="username"
                         />
                         {state.errors.username && (
                             <p className="mt-2 text-red-500 text-sm">{state.errors.username}</p>
                         )}
                     </div>
                     <div>
                         <label>Password</label>
                         <PasswordField
                             field={fieldDefinitions.password}
                             // @ts-ignore
                             value={model.password ?? ""}
                             path="password"
                             updateModelValue={(path, definition, value) =>
                                 updateModelValue(path, definition, value, true)
                             }
                             onBlur={() =>
                                 updateModelValue("password", fieldDefinitions.password, model.password, true)
                             }
                             autoComplete="current-password"
                         />
                         {state.errors.password && (
                             <p className="mt-2 text-red-500 text-sm">{state.errors.password}</p>
                         )}
                     </div>
                     
                     <div className='flex justify-center'>
                         <button type="submit" className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline">Login</button>
                     </div>
                 </form>
             </div>
         </div>
     );
 }
