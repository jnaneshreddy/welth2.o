"use client"
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { accountSchema } from "@/app/lib/schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { createAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";



const CreateAccountDrawer = ({children}) => {
    const [open,setopen] = useState(false); 

    //validation account schema 
    const {register,handleSubmit,formState:{errors},setValue,watch,reset,} = useForm({
        resolver:zodResolver(accountSchema),
        defaultValues:{
            name:"",
            type:"CURRENT",
            balance:"",
            isDefault:false,
        }
    });

    const {data:newAccount,error,fn:createAccountfn,loading:createAccountLoading }=useFetch(createAccount)
    useEffect(()=>{
    if(newAccount&&!createAccountLoading){
      toast.success("Account Created succesfully ")
      reset();
      setopen(false)
    }

    },[createAccountLoading,])

    useEffect(()=>{
      if(error){
        toast.error(error.message || "faild to create account ")
      }

    },[error])

    const onSubmit = async(data) =>{
        console.log(data)
        await createAccountfn(data)
    }
  return (
    <Drawer open={open} onOpenChange={setopen}>
  <DrawerTrigger asChild>{children}</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Create New Account</DrawerTitle>
    </DrawerHeader>
    <div className="px-4 pb-4">
        <form action="" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Account Name</label>
            <Input id="name"
            placeholder="Name Of the Account"
            {...register("name")}/>
            {errors.name && (
                <p className="text-sm text-red-500 ">{errors.name.message}</p>
            )}
        </div>

         <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Account Type
            </label>
            <Select
            onValueChange={(value) => setValue("type", value)}
            defaultValue={watch("type")}
            className="w-full"
            >
            <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="CURRENT">Current</SelectItem>
                <SelectItem value="SAVINGS">Savings</SelectItem>
            </SelectContent>
            </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="balance"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-base font-medium cursor-pointer"
                >
                  Set as Default
                </label>
                <p className="text-sm text-muted-foreground">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

<div className="flex gap-4 pt-4">
  <DrawerClose className="flex-1">
    <Button type="button" variant="outline" className="w-full">
      Cancel
    </Button>
  </DrawerClose>
  <Button type="submit" className="flex-1 w-full" disabled={createAccountLoading}>
    {createAccountLoading?(<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>creating ... </>):("Create Account")}
  </Button>
</div>

        </form>
    </div>
  </DrawerContent>
</Drawer>
  )
}

export default CreateAccountDrawer