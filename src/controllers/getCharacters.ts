import { Request, Response } from 'express';
import { prisma } from '../services';
import { logger, toFeet, swapiService } from '../utils';

// GET /characters?sort_by=name|gender\height&order=asc\des&filter=male\female
export const getCharacters = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sort_by, order, filter } = req.query as {
      sort_by: string;
      order: string;
      filter: string;
    };

    const people = await swapiService('people');

    const dataArray = people.data.results.filter(
      (character: { gender: string; height: number }) => {
        character.height = Number(character.height);
        return character.gender === filter || character.gender === filter;
      }
    );

    let metadata: any = {};
    let sortedDesc: any = [];
    let sortedAsc: any = [];

    if (order === 'desc' && sort_by === 'height') {
      sortedDesc = dataArray.sort(
        (a: { height: number }, b: { height: number }) => b.height - a.height
      );
      metadata = {
        count: sortedDesc.length,
        total_height: {
          cm: sortedDesc.reduce((sum: number, b: { height: number }) => {
            return sum + b.height;
          }, 0),
          feet: '',
        },
      };

      metadata.total_height.feet = toFeet(metadata.total_height.cm);
      metadata.total_height.cm = metadata.total_height.cm + 'cm';
    }

    if (order === 'asc' && sort_by === 'height') {
      sortedAsc = dataArray.sort(
        (a: { height: number }, b: { height: number }) => a.height - b.height
      );
      metadata = {
        count: sortedAsc.length,
        total_height: {
          cm: sortedAsc.reduce((sum: number, b: { height: number }) => {
            return sum + b.height;
          }, 0),
          feet: '',
        },
      };

      metadata.total_height.feet = toFeet(metadata.total_height.cm);
      metadata.total_height.cm = metadata.total_height.cm + 'cm';
    }

    if ((order === 'asc' && sort_by == 'name') || sort_by == 'gender') {
      sortedAsc = dataArray.sort(
        (
          a: { name: string; gender: string },
          b: { name: string; gender: string }
        ) => a.name.localeCompare(b.name) || a.gender.localeCompare(b.gender)
      );
      metadata = {
        count: sortedAsc.length,
        total_height: {
          cm: sortedAsc.reduce((sum: number, b: { height: number }) => {
            return sum + b.height;
          }, 0),
          feet: '',
        },
      };

      metadata.total_height.feet = toFeet(metadata.total_height.cm);
      metadata.total_height.cm = metadata.total_height.cm + 'cm';
    }

    if ((order === 'desc' && sort_by === 'name') || sort_by === 'gender') {
      sortedDesc = dataArray.sort(
        (
          a: { name: string; gender: string },
          b: { name: string; gender: string }
        ) => b.name.localeCompare(a.name) || b.gender.localeCompare(a.gender)
      );

      metadata = {
        count: sortedDesc.length,
        total_height: {
          cm: sortedDesc.reduce((sum: number, b: { height: number }) => {
            return sum + b.height;
          }, 0),
          feet: '',
        },
      };

      metadata.total_height.feet = toFeet(metadata.total_height.cm);
      metadata.total_height.cm = metadata.total_height.cm + 'cm';
    }
    if (sortedDesc < 1) {
      sortedDesc = undefined;
    }
    if (sortedAsc < 1) {
      sortedAsc = undefined;
    }

    res.status(200);
    res.json({ success: true, metadata, sortedAsc, sortedDesc });
  } catch (err) {
    logger.error('GET /characters/ prisma error');
    res.status(500);
    res.json({ success: false, msg: err.message, err });
  } finally {
    await prisma.$disconnect();
  }
};

export default getCharacters;
