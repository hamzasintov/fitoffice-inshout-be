import { AppDataSource } from '../orm/ormconfig';
import { Package } from '../orm/entities/Package';
import { VdsError } from '../util/vds-error/vdsError';
import logger from '../util/logger';

export async function insertPackage(newPackage: Package) {
  try {
    const {
      trackingNumber,
      carrier,
      status,
      condition,
      sender,
      recipientName,
      comment
    } = newPackage;

    const repo = AppDataSource.getRepository(Package);
    const fitPackageDb = await repo.findOne({ where: { trackingNumber } });
    if (fitPackageDb)
      throw new VdsError(400, 'General', 'Package already exists', [
        ` Package with tracking # '${trackingNumber}' already exists`
      ]);

    const fitPackage = new Package();
    fitPackage.trackingNumber = trackingNumber;
    fitPackage.carrier = carrier;
    fitPackage.status = status;
    fitPackage.sender = sender;
    fitPackage.recipientName = recipientName;
    fitPackage.comment = comment;
    fitPackage.urgent = newPackage.urgent ?? false;
    fitPackage.condition = condition;
    try {
      const savedPackage = await repo.save(fitPackage);
      return { package: savedPackage };
    } catch {
      throw new VdsError(400, 'General', 'Package not saved', [
        ` Package with tracking # '${trackingNumber}' not saved`
      ]);
    }
  } catch (error) {
    logger.error('Unable to add package');
    throw error;
  }
}

export async function softDeletePackage(id: number) {
  try {
    const repo = AppDataSource.getRepository(Package);
    const fitPackage = await repo.findOne({ where: { id } });
    if (!fitPackage)
      throw new VdsError(404, 'General', `Package doesnt exist`, [
        ` Package with id ${id} doesnt exists`
      ]);

    fitPackage.isDeleted = true;
    fitPackage.deletedAt = new Date();
    try {
      const delPackage = await repo.update({ id: fitPackage.id }, fitPackage);
      return { softDelete: delPackage };
    } catch {
      throw new VdsError(400, 'General', `Unable to delete the package`, [
        `Package with id ${fitPackage.id} is not deleted`
      ]);
    }
  } catch (error) {
    logger.error('Unable to delete package');
    throw error;
  }
}

export async function getAllPackages(
  page: number,
  limit: number,
  skip: number
) {
  try {
    const repo = AppDataSource.getRepository(Package);
    const [packages, total] = await repo.findAndCount({
      skip,
      take: limit
    });
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      packages
    };
  } catch (error) {
    logger.error('Cannot get the packages');
    throw error;
  }
}

export async function updatePackages(packages: Package[]) {
  try {
    const repo = AppDataSource.getRepository(Package);
    const updatedPackages: { id: number; affected: number | undefined }[] = [];
    for (const packageToUpdate of packages) {
      const fitPackage = await repo.findOne({
        where: { id: packageToUpdate.id }
      });
      if (!fitPackage)
        throw new VdsError(400, 'General', 'Package doesnt exist', [
          ` Package with id ${packageToUpdate.id} doesnt exists`
        ]);
      fitPackage.isDeleted = packageToUpdate.isDeleted ?? false;
      fitPackage.deletedAt = packageToUpdate.deletedAt ?? null;
      fitPackage.updated_at = new Date();
      fitPackage.trackingNumber =
        packageToUpdate.trackingNumber || fitPackage.trackingNumber;
      fitPackage.carrier = packageToUpdate.carrier || fitPackage.carrier;
      fitPackage.status = packageToUpdate.status || fitPackage.status;
      fitPackage.condition = packageToUpdate.condition || fitPackage.condition;
      fitPackage.sender = packageToUpdate.sender || fitPackage.sender;
      fitPackage.recipientName =
        packageToUpdate.recipientName || fitPackage.recipientName;
      fitPackage.comment = packageToUpdate.comment || fitPackage.comment;
      fitPackage.urgent =
        packageToUpdate.urgent !== undefined
          ? packageToUpdate.urgent
          : fitPackage.urgent;
      try {
        const resp = await repo.update({ id: fitPackage.id }, fitPackage);
        updatedPackages.push({ id: fitPackage.id, affected: resp.affected });
      } catch {
        throw new VdsError(400, 'General', 'Package doesnt updated', [
          ` Package with id ${packageToUpdate.id} doesnt update`
        ]);
      }
    }
    return { updatedPackages: updatedPackages };
  } catch (error) {
    logger.error('Cannot update the packages');
    throw error;
  }
}
