import { Request, Response } from 'express';
// files
import prisma from '../services/prismaClient';
import logger from '../utils/winstonLogger';
import axios from 'axios'
import { type } from 'node:os';
import { stringify } from 'node:querystring';
import { runInThisContext } from 'node:vm';

// GET /users
export const getUsers = async (_: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();

    res.status(200);
    res.json({ success: true, users });
  } catch (err) {
    logger.error('GET /users prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};

// GET /users/:id
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params?.id),
      },
    });

    res.status(200);
    res.json({ success: true, user });
  } catch (err) {
    logger.error('GET /users/:id prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};

// GET /movies/:created
export const getmovies = async (req: Request, res: Response): Promise<void> => {
  try {
    axios.get('https://swapi.dev/api/films/').then((result) => {
      // movienames
      // opening crawls
      // release_date
      // counts_of_comments
      const dataArray = result.data.results.map((movie: {             
        release_date: string | number | Date;
        title: string;
        opening_crawl: string;
       })=>{
        movie.release_date = new Date(movie.release_date)
        return {
          title: movie.title,
          opening_crawl : movie.opening_crawl,
          release_date: movie.release_date
        }
      })

      const sortedActivities = dataArray.sort((a: { release_date: number; }, b: { release_date: number; }) => b.release_date - a.release_date)

      // console.log(sortedActivities);
      res.status(200);
      res.json({ success: true, sortedActivities });
  }).catch((error) => {
    // console.log(error.message);
    res.status(401);
    res.json({ success: true, error: error.message });
  })
    // });
  } catch (err) {
    logger.error('GET /movies/ prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};

// GET /characters?sort_by=name|gender\height&order=asc\des&filter=male\female
export const getcharacter = async (req: Request, res: Response): Promise<void> => {
  try {

    const {sort_by, order, filter} = req.query || {};

    console.log(sort_by, order, filter)
    
// convert cm to ft/inches
    const  toFeet =(n:number) => {
      const realFeet = ((n*0.393700) / 12);
      const feet = Math.floor(realFeet);
      const inches = Math.round((realFeet - feet) * 12);
      return feet + "ft/" + inches + 'inches';
    }


    axios.get('https://swapi.dev/api/people/')
    .then((result) => {
     
// filter
      const dataArray = result.data.results.filter((character:{
        gender: string,
        height: number,
      })=>{
        character.height = Number(character.height)
        return character.gender === filter || character.gender === filter;
      })
      // console.log(dataArray)
// sort \ name \ gender \ height
     if (order === "desc" && sort_by  === "height"){

      const sortedDesc = dataArray.sort((a: { height: number; }, b: { height: number; }) => b.height - a.height)
      const metadata = {
        count: sortedDesc.length
      } 
      console.log("descending",metadata,sortedDesc)

      res.status(200);
      res.json({ success: true,metadata, sortedDesc });
      
    }

    if (order === "asc" && sort_by  === "height"){

      const sortedAsc = dataArray.sort((a: { height: number; }, b: { height: number; }) => a.height -  b.height)
      const metadata = {
        count: sortedAsc.length
      } 
      console.log("ascending", metadata, sortedAsc)
      res.status(200);
      res.json({ success: true,metadata, sortedAsc });
      
    }

    if (order === "asc" && sort_by  == "name" || sort_by == "gender"){


      const sortedAsc = dataArray.sort((a:{name:string, gender:string}, b:{name:string, gender:string}) => a.name.localeCompare(b.name) || a.gender.localeCompare(b.gender));
      const metadata = {
        count: sortedAsc.length
      } 
      
      console.log("descending",metadata, sortedAsc)

      res.status(200);
      res.json({ success: true,metadata, sortedAsc });
      return;
    }

    if (order === "desc" && sort_by  === "name" || sort_by === "gender"){
``
      const sortedDesc = dataArray.sort((a:{name:string, gender:string}, b:{name:string, gender:string}) => b.name.localeCompare(a.name) || b.gender.localeCompare(a.gender));
      console.log( parseInt(sortedDesc[0].height) + parseInt(sortedDesc[1].height))
      const metadata = {
        count: sortedDesc.length,
        total_height: {
          cm: sortedDesc.reduce((sum: number,b:{ height: number})=> {
          return sum + b.height 
        },0),
        feet: ""
      }  
      } 
      
      metadata.total_height.feet =  toFeet(metadata.total_height.cm)
      metadata.total_height.cm = metadata.total_height.cm +"cm"
      
      console.log("descending",metadata, sortedDesc)

      res.status(200);
      res.json({ success: true, metadata, sortedDesc });
    }
  })
    .catch((error)=> {
      console.log(error)
      res.status(401);
      res.json({ success: true, error: error.message });
    })

    
  } catch (err) {
    console.log(err)
    logger.error('GET /users/:id prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};

// POST /users
export const postUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, age } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        age,
      },
    });

    res.status(200);
    res.json({ success: true, user });
  } catch (err) {
    logger.error('POST /users prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};

// PUT /users/:id
export const putUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, age } = req.body;

    // TODO: check first if user exists biar gak error 500

    const user = await prisma.user.update({
      where: {
        id: parseInt(req.params?.id),
      },
      data: {
        name,
        age,
      },
    });

    res.status(200);
    res.json({ success: true, user });
  } catch (err) {
    logger.error('PUT /users/:id prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};

// DELETE /users/:id
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // TODO: check first if user exists biar gak error 500

    const user = await prisma.user.delete({
      where: {
        id: parseInt(req.params?.id),
      },
    });

    res.status(200);
    res.json({ success: true, user });
  } catch (err) {
    logger.error('DELETE /users/:id prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};
