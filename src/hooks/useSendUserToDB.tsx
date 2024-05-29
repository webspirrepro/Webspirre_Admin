import { supabase } from "@/libs/supabase";
import { User } from "@/types/types";
import React from "react";
import useAuth from "./useAuth";
import { Session } from "@supabase/supabase-js";
type SendUserFunction = () => Promise<void>;

const useSendUserToDB = () => {
  const { setAuth } = useAuth();

  const sendToDb = async (data: Session) => {
    if (data) {
      const { user } = data;
      const { id, email } = user;
      //   const idAsBigInt = String(BigInt(`0x${id.replace(/-/g, "")}`));
      console.log("supabase data", data);
      const { data: userData, error: insertError } = await supabase
        .from("administrators")
        .insert([
          {
            email,
            created_at: new Date(),
            userid: id,
            role: "ROLE_USER",
          },
        ]);

      if (insertError) {
        console.log("Error Message", insertError.message);
        throw insertError;
      }
      return userData;
    }
  };

  return sendToDb;
};

export default useSendUserToDB;
