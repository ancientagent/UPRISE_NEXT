import { RegistrarController } from '../src/registrar/registrar.controller';

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
});
