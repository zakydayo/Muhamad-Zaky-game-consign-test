'use client';
import {logout} from "@/actions/logout";
import {FormModel, FormSchema} from "@/components/form/types";
import {useFormGen} from "@/components/form/useFormGen";
import {FormGenerator} from "@/components/form/FormGenerator";
import {Button} from "@/components/ui/button";

export default function FormPage() {
    const initialModel: FormModel = {
        first_name: "",
        last_name: ""
    };

    const schema = {
        name: "simple-form",
        definitions: [
            {
                name: "first_name",
                type: "text",
                label: {text: "First Name"},
                rules: [{name: "required"}]
            },
            {
                name: "last_name",
                type: "text",
                label: {text: "Last Name"},
                rules: [{name: "required"}]
            },
        ],
    } as FormSchema;

    const { state, model, updateModelValue, handleSubmit } = useFormGen({
        schema: schema,
        model: initialModel
    });

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     console.log(model, state.isDirty);
    // };

    const logSubmit = async (model: FormModel) => {
        console.log(model);
    }
    
    // TODO: Challenge #2: Browser console is throwing a warning. Fix it.
    return (
        <div className="flex flex-col gap-5 p-5 bg-zinc-100 w-full h-dvh">
            <div className="flex justify-between items-baseline">
                <h1 className='font-bold text-2xl'>Form Page</h1>
                <form action={logout}>
                    <button type="submit" className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline">Logout</button>
                </form>
            </div>

            <div className='w-full bg-white rounded p-5 md:w-6/12'>
                <form onSubmit={handleSubmit(logSubmit)}>
                    <FormGenerator schema={schema} state={state} model={model} updateModelValue={updateModelValue}/>

                    <div className="flex justify-end">
                        <Button className="mt-5 rounded-xl" variant="default" type="submit">Submit</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}