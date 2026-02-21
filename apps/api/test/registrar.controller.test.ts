import { RegistrarController } from '../src/registrar/registrar.controller';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('RegistrarController', () => {
  it('submits promoter registration through registrar service', async () => {
    const registrarService = {
      submitPromoterRegistration: jest.fn().mockResolvedValue({
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        createdById: 'u-1',
        payload: { productionName: 'Southside Signal Co.' },
      }),
    } as any;

    const controller = new RegistrarController(registrarService);

    const response = await controller.submitPromoterRegistration(
      {
        sceneId: '11111111-1111-1111-1111-111111111111',
        productionName: 'Southside Signal Co.',
      },
      { user: { userId: 'u-1' } },
    );

    expect(registrarService.submitPromoterRegistration).toHaveBeenCalledWith('u-1', {
      sceneId: '11111111-1111-1111-1111-111111111111',
      productionName: 'Southside Signal Co.',
    });
    expect(response).toEqual({
      success: true,
      data: {
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        createdById: 'u-1',
        payload: { productionName: 'Southside Signal Co.' },
      },
    });
  });

  it('lists submitter promoter registrations through registrar service', async () => {
    const registrarService = {
      listPromoterRegistrations: jest.fn().mockResolvedValue({
        total: 1,
        countsByStatus: { submitted: 1 },
        entries: [
          {
            id: 'reg-promoter-1',
            type: 'promoter_registration',
            status: 'submitted',
            sceneId: '11111111-1111-1111-1111-111111111111',
            payload: { productionName: 'Southside Signal Co.' },
          },
        ],
      }),
    } as any;

    const controller = new RegistrarController(registrarService);

    const response = await controller.listMyPromoterRegistrations({ user: { userId: 'u-1' } });

    expect(registrarService.listPromoterRegistrations).toHaveBeenCalledWith('u-1');
    expect(response).toEqual({
      success: true,
      data: {
        total: 1,
        countsByStatus: { submitted: 1 },
        entries: [
          {
            id: 'reg-promoter-1',
            type: 'promoter_registration',
            status: 'submitted',
            sceneId: '11111111-1111-1111-1111-111111111111',
            payload: { productionName: 'Southside Signal Co.' },
          },
        ],
      },
    });
  });

  it('reads submitter promoter registration detail through registrar service', async () => {
    const registrarService = {
      getPromoterRegistration: jest.fn().mockResolvedValue({
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        payload: { productionName: 'Southside Signal Co.' },
      }),
    } as any;

    const controller = new RegistrarController(registrarService);

    const response = await controller.getMyPromoterRegistration('reg-promoter-1', {
      user: { userId: 'u-1' },
    });

    expect(registrarService.getPromoterRegistration).toHaveBeenCalledWith('u-1', 'reg-promoter-1');
    expect(response).toEqual({
      success: true,
      data: {
        id: 'reg-promoter-1',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: '11111111-1111-1111-1111-111111111111',
        payload: { productionName: 'Southside Signal Co.' },
      },
    });
  });

  it('propagates promoter list read errors from registrar service', async () => {
    const registrarService = {
      listPromoterRegistrations: jest.fn().mockRejectedValue(new ForbiddenException('No access')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(controller.listMyPromoterRegistrations({ user: { userId: 'u-1' } })).rejects.toThrow(
      ForbiddenException,
    );
    expect(registrarService.listPromoterRegistrations).toHaveBeenCalledWith('u-1');
  });

  it('propagates promoter detail read errors from registrar service', async () => {
    const registrarService = {
      getPromoterRegistration: jest.fn().mockRejectedValue(new NotFoundException('Registrar entry not found')),
    } as any;
    const controller = new RegistrarController(registrarService);

    await expect(
      controller.getMyPromoterRegistration('missing-entry', { user: { userId: 'u-1' } }),
    ).rejects.toThrow(NotFoundException);
    expect(registrarService.getPromoterRegistration).toHaveBeenCalledWith('u-1', 'missing-entry');
  });
});
