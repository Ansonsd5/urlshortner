import { supabase, supabaseUrl } from "./supabase";

export async function getUrls(user) {
  const { error, data } = await supabase
    .from("url")
    .select("*")
    .eq("user_id", user);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load data ");
  }
  return data;
}

export async function deleteUrl(id) {
  const { error, data } = await supabase.from("url").delete().eq("id", id);

  if (error) {
    console.error("Unable to delete the link");
    throw new Error("Unable to delete the record");
  }
  return data;
}

export async function createUrl(
  { longUrl, title, customUrl, user_id },
  qrcode
) {
  const short_url = Math.random().toLocaleString(36).substring(2, 8);
  const fileName = `qr-${short_url}`;

  const { error, data } = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  if (error) {
    console.error("Failed to uplaod the QR code");
    throw new Error("Could not do the operations");
  }

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const { error: createUrlError, data: createdUrl } = await supabase
    .from("url")
    .insert([
      {
        title,
        original_url: longUrl,
        short_url,
        custom_url: customUrl || null,
        user_id,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error("Failed to uplaod the QR code");
    throw new Error("Could not do the operations");
  }

  return createdUrl;
}


export async function getLongUrl(id) {
  const { error, data } = await supabase
    .from("url")
    .select("id,original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (error) {
    console.error("Unable to getLongUrl");
    throw new Error("Unable to fetch the record");
  }

  return data;
}

export async function getClicksForUrl(url_id) {
  const { data, error } = await supabase.from("clicks").select("*").eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }
console.log("data***",data)
  return data;
}

export async function getUrl({ id, user_id }) {
  const { error, data } = await supabase
    .from("url")
    .select("*")
    .eq("id",id)
    .eq("user_id",user_id).single();

  if (error) {
    console.log(error.message);

    throw new Error("Short url not created");
  }

  return data;
}
