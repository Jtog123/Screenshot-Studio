import * as THREE from 'three'

export interface ImageComponentInterface{
    id: string,
    position: string,
    type: string
}

export interface TextComponentInterface{
    id: string,
    position: string,
    type: string
}
/*
export interface ScreenTextureInterface{
    id:string
    type:string
    imgPath:File
}
    */
export interface ScreenTextureInterface{
    id:string
    type:string
    imgPath:string
    screenTexture:THREE.Texture
}

export interface CapturedImage {
    id: string;
    imgPath: string;
}

export interface AspectRatio {
    width: number;
    height: number, 
    type:string 
}

