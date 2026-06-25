import { aiServerURL } from "@/lib/urls";
import { ReconCategoryType, reconTypes } from "@repo/validation";
import { NextRequest, NextResponse } from "next/server";


// Define the exact shape of the AI response data
type AIResponseData = {
  title: string;
  category: ReconCategoryType,
  instructions: string;
};

export type magicFillResponseType =
  { success: true; aiResponse: AIResponseData }
  | { success: false; error: string };



export async function POST(req: NextRequest) {
  try {

    const body = await req.json();

    const magicFillURL = `${aiServerURL}/magic-fill/recon`;

    const response = await fetch(magicFillURL, {
      method: "POST",
      body: JSON.stringify(body)
    });

    const data: magicFillResponseType = await response.json();

    if (data) {
      return NextResponse.json(data);
    }
    else {
      return NextResponse.json({ success: false, error: "No data returned, Please try again." })
    }

  } catch (error) {

    console.error("Error in (web) magicFill POST route: ", error);

    return NextResponse.json({ success: false, error: "Failed to auto fill." }, { status: 500 });
  }
}