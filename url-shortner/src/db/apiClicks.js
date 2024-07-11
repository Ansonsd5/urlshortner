import { UAParser } from "ua-parser-js";
import { supabase } from "./supabase";

export async function getClicks(urlIds) {


const { data, error } = await  supabase.from('clicks').select("*").in("url_id",urlIds)

  if (error) {
    throw new Error("Unable to load click data");
  }
  return data;
}


const parser = new UAParser();

export const storeClicks =async  ({id, originalUrl}) =>{
  try {
  
    const response = parser.getResult();
    const device = response?.type || "desktop";
  
    const ipres = await fetch('https://ipapi.co/json');
  
    const {city, country_name :country} =await ipres.json();
  
    await supabase.from("clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });
  
    window.location.href = originalUrl;
  } catch (error) {
    console.log("Error storing the click");
  throw  new Error('Unable to store the click')}
  }
